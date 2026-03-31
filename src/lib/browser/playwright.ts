import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { BrowserManager, BrowserPage, BrowserLocator, PlatformSession } from './types';

class PlaywrightLocator implements BrowserLocator {
  constructor(private locator: any) {}

  first(): BrowserLocator {
    return new PlaywrightLocator(this.locator.first());
  }

  async click(): Promise<void> {
    await this.locator.first().click();
  }

  async fill(text: string): Promise<void> {
    await this.locator.first().fill(text);
  }

  async count(): Promise<number> {
    return await this.locator.count();
  }
}

class PlaywrightPage implements BrowserPage {
  constructor(private page: Page) {}

  async goto(url: string, options?: { waitUntil?: string }): Promise<void> {
    await this.page.goto(url, { waitUntil: options?.waitUntil as any || 'networkidle' });
  }

  async evaluate<T>(fn: () => T): Promise<T> {
    return await this.page.evaluate(fn);
  }

  locator(selector: string): BrowserLocator {
    return new PlaywrightLocator(this.page.locator(selector));
  }

  async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  async close(): Promise<void> {
    await this.page.close();
  }
}

export class PlaywrightBrowserManager implements BrowserManager {
  private browser: Browser | null = null;
  private contexts: Map<string, BrowserContext> = new Map();

  async launch(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920,1080',
        ],
      });
      console.log('[Playwright Browser] Launched');
    }
    return this.browser;
  }

  async close(): Promise<void> {
    for (const [key, context] of Array.from(this.contexts.entries())) {
      await context.close();
      console.log(`[Playwright Browser] Context closed: ${key}`);
    }
    this.contexts.clear();

    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log('[Playwright Browser] Closed');
    }
  }

  private async getContext(session: PlatformSession): Promise<BrowserContext> {
    const key = `${session.platformId}_${session.userAgent || 'default'}`;
    
    if (this.contexts.has(key)) {
      return this.contexts.get(key)!;
    }

    const browser = await this.launch();

    const cookies = Object.entries(session.cookies).map(([name, value]) => ({
      name,
      value,
      domain: this.getDomainForPlatform(session.platformId),
      path: '/',
      httpOnly: false,
      secure: true,
      sameSite: 'None' as const,
    }));

    const context = await browser.newContext({
      userAgent: session.userAgent || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      locale: 'zh-CN',
      timezoneId: 'Asia/Shanghai',
    });

    if (cookies.length > 0) {
      await context.addCookies(cookies);
    }

    if (session.localStorage) {
      const page = await context.newPage();
      await page.goto(`https://${this.getDomainForPlatform(session.platformId)}`);
      await page.evaluate((data) => {
        Object.entries(data).forEach(([k, v]) => {
          localStorage.setItem(k, v);
        });
      }, session.localStorage);
      await page.close();
    }

    this.contexts.set(key, context);
    return context;
  }

  async getPage(session: PlatformSession): Promise<BrowserPage> {
    const context = await this.getContext(session);
    const page = await context.newPage();
    return new PlaywrightPage(page);
  }

  private getDomainForPlatform(platformId: string): string {
    const domains: Record<string, string> = {
      twitter: 'x.com',
      jike: 'web.okjike.com',
      linkedin: 'www.linkedin.com',
      weibo: 'weibo.com',
      xiaohongshu: 'www.xiaohongshu.com',
    };
    return domains[platformId] || 'example.com';
  }
}

let playwrightManager: PlaywrightBrowserManager | null = null;

export function getPlaywrightBrowserManager(): PlaywrightBrowserManager {
  if (!playwrightManager) {
    playwrightManager = new PlaywrightBrowserManager();
  }
  return playwrightManager;
}