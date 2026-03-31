import CDP from 'chrome-remote-interface';

export interface PlatformSession {
  platformId: string;
  cookies: Record<string, string>;
  localStorage?: Record<string, string>;
  headers?: Record<string, string>;
  userAgent?: string;
  validUntil?: Date;
}

interface CDPOptions {
  host?: string;
  port?: number;
}

interface DomainCookies {
  name: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
  httpOnly: boolean;
}

export class CDPBridge {
  private host: string;
  private port: number;
  private client: any = null;

  constructor(options: CDPOptions = {}) {
    this.host = options.host || process.env.CDP_HOST || 'localhost';
    this.port = options.port || parseInt(process.env.CDP_PORT || '9222');
  }

  async connect(): Promise<boolean> {
    try {
      this.client = await CDP({
        host: this.host,
        port: this.port,
      });
      console.log('[CDP] Connected to Chrome');
      return true;
    } catch (error) {
      console.error('[CDP] Connection failed:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      console.log('[CDP] Disconnected');
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      if (!this.client) return false;
      await this.client.Runtime.evaluate({ expression: '1' });
      return true;
    } catch {
      return false;
    }
  }

  async getCookies(domain: string): Promise<DomainCookies[]> {
    if (!this.client) {
      throw new Error('CDP not connected');
    }

    try {
      const { cookies } = await this.client.Network.getCookies({
        urls: [`https://${domain}`, `https://*.${domain}`],
      });
      return cookies;
    } catch (error) {
      console.error(`[CDP] Failed to get cookies for ${domain}:`, error);
      return [];
    }
  }

  async getAllCookies(): Promise<DomainCookies[]> {
    if (!this.client) {
      throw new Error('CDP not connected');
    }

    try {
      const { cookies } = await this.client.Network.getAllCookies();
      return cookies;
    } catch (error) {
      console.error('[CDP] Failed to get all cookies:', error);
      return [];
    }
  }

  async getLocalStorage(domain: string): Promise<Record<string, string>> {
    if (!this.client) {
      throw new Error('CDP not connected');
    }

    try {
      // Get all tabs/pages
      const { targetInfos } = await this.client.Target.getTargets();
      
      for (const target of targetInfos) {
        if (target.url.includes(domain)) {
          // Attach to the target
          const { sessionId } = await this.client.Target.attachToTarget({
            targetId: target.targetId,
            flatten: true,
          });

          // Get localStorage
          const { result } = await this.client.Runtime.evaluate({
            expression: 'JSON.stringify(localStorage)',
            returnByValue: true,
          });

          await this.client.Target.detachFromTarget({ sessionId });

          if (result && result.value) {
            return JSON.parse(result.value);
          }
        }
      }
      return {};
    } catch (error) {
      console.error(`[CDP] Failed to get localStorage for ${domain}:`, error);
      return {};
    }
  }

  async extractSession(platformId: string, domains: string[]): Promise<PlatformSession | null> {
    try {
      const allCookies: DomainCookies[] = [];
      const allLocalStorage: Record<string, string> = {};

      for (const domain of domains) {
        const cookies = await this.getCookies(domain);
        allCookies.push(...cookies);

        const localStorage = await this.getLocalStorage(domain);
        Object.assign(allLocalStorage, localStorage);
      }

      if (allCookies.length === 0) {
        console.warn(`[CDP] No cookies found for ${platformId}`);
        return null;
      }

      // Convert cookies to record
      const cookiesRecord: Record<string, string> = {};
      for (const cookie of allCookies) {
        cookiesRecord[cookie.name] = cookie.value;
      }

      // Get user agent
      const { result } = await this.client.Runtime.evaluate({
        expression: 'navigator.userAgent',
        returnByValue: true,
      });

      return {
        platformId,
        cookies: cookiesRecord,
        localStorage: Object.keys(allLocalStorage).length > 0 ? allLocalStorage : undefined,
        userAgent: result?.value,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      };
    } catch (error) {
      console.error(`[CDP] Failed to extract session for ${platformId}:`, error);
      return null;
    }
  }

  async getCDPVersion(): Promise<any> {
    if (!this.client) {
      throw new Error('CDP not connected');
    }
    return await this.client.Browser.getVersion();
  }
}

// Singleton instance
let cdpBridge: CDPBridge | null = null;

export function getCDPBridge(): CDPBridge {
  if (!cdpBridge) {
    cdpBridge = new CDPBridge();
  }
  return cdpBridge;
}

export async function checkCDPStatus(): Promise<{ connected: boolean; version?: string; error?: string }> {
  const bridge = getCDPBridge();
  const connected = await bridge.connect();
  
  if (connected) {
    try {
      const version = await bridge.getCDPVersion();
      await bridge.disconnect();
      return {
        connected: true,
        version: `${version.product} (${version.protocolVersion})`,
      };
    } catch (error) {
      return {
        connected: true,
        error: 'Failed to get version',
      };
    }
  }

  return {
    connected: false,
    error: 'Cannot connect to Chrome. Make sure Chrome is running with --remote-debugging-port=9222',
  };
}
