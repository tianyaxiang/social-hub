import CDP from 'chrome-remote-interface';
import { BrowserManager, BrowserPage, BrowserLocator } from './types';

class CDPLocator implements BrowserLocator {
  constructor(private client: any, private selector: string) {}

  first(): BrowserLocator {
    return this;
  }

  async click(): Promise<void> {
    await this.client.Runtime.evaluate({
      expression: `document.querySelector('${this.selector}')?.click()`,
      awaitPromise: true,
    });
  }

  async fill(text: string): Promise<void> {
    await this.client.Runtime.evaluate({
      expression: `
        const el = document.querySelector('${this.selector}');
        if (el) {
          el.value = '${text.replace(/'/g, "\\'")}';
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }
      `,
      awaitPromise: true,
    });
  }

  async count(): Promise<number> {
    const { result } = await this.client.Runtime.evaluate({
      expression: `document.querySelectorAll('${this.selector}').length`,
      returnByValue: true,
    });
    return result?.value || 0;
  }
}

class CDPPage implements BrowserPage {
  private client: any;
  private targetId: string;

  constructor(client: any, targetId: string) {
    this.client = client;
    this.targetId = targetId;
  }

  async goto(url: string, options?: { waitUntil?: string }): Promise<void> {
    await this.client.Page.navigate({ url });
    // Wait for load event
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  async evaluate<T>(fn: () => T): Promise<T> {
    const script = fn.toString();
    const { result } = await this.client.Runtime.evaluate({
      expression: `(${script})()`,
      returnByValue: true,
    });
    return result?.value;
  }

  locator(selector: string): BrowserLocator {
    return new CDPLocator(this.client, selector);
  }

  async waitForTimeout(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  async close(): Promise<void> {
    // CDP pages are managed by Chrome, we just detach
  }
}

export class CDPBrowserManager implements BrowserManager {
  private client: any = null;
  private host: string;
  private port: number;

  constructor() {
    this.host = process.env.CDP_HOST || 'localhost';
    this.port = parseInt(process.env.CDP_PORT || '9222');
  }

  private async connect(): Promise<any> {
    if (!this.client) {
      this.client = await CDP({
        host: this.host,
        port: this.port,
      });
      console.log('[CDP Browser] Connected');
    }
    return this.client;
  }

  async getPage(_session?: any): Promise<BrowserPage> {
    const client = await this.connect();
    
    // Get available targets
    const { targetInfos } = await client.Target.getTargets();
    
    // Find an existing page or create new
    let target = targetInfos.find((t: any) => t.type === 'page' && t.url !== 'about:blank');
    
    if (!target) {
      // Create new target
      const { targetId } = await client.Target.createTarget({ url: 'about:blank' });
      const targets = await client.Target.getTargets();
      target = targets.targetInfos.find((t: any) => t.targetId === targetId);
    }

    // Attach to target
    const { sessionId } = await client.Target.attachToTarget({
      targetId: target.targetId,
      flatten: true,
    });

    return new CDPPage(client, target.targetId);
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      console.log('[CDP Browser] Disconnected');
    }
  }
}

let cdpManager: CDPBrowserManager | null = null;

export function getCDPBrowserManager(): CDPBrowserManager {
  if (!cdpManager) {
    cdpManager = new CDPBrowserManager();
  }
  return cdpManager;
}