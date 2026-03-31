import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { PlatformSession } from '@/lib/platforms/adapter';

export class PlaywrightManager {
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
      console.log('[Playwright] Browser launched');
    }
    return this.browser;
  }

  async close(): Promise<void> {
    for (const [key, context] of Array.from(this.contexts.entries())) {
      await context.close();
      console.log(`[Playwright] Context closed: ${key}`);
    }
    this.contexts.clear();

    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log('[Playwright] Browser closed');
    }
  }

  async getContext(session: PlatformSession): Promise<BrowserContext> {
    const key = `${session.platformId}_${session.userAgent || 'default'}`;
    
    if (this.contexts.has(key)) {
      return this.contexts.get(key)!;
    }

    const browser = await this.launch();

    // Convert cookies to Playwright format
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

    // Add cookies
    if (cookies.length > 0) {
      await context.addCookies(cookies);
    }

    // Set localStorage if available
    if (session.localStorage) {
      const page = await context.newPage();
      await page.goto(`https://${this.getDomainForPlatform(session.platformId)}`);
      await page.evaluate((data) => {
        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });
      }, session.localStorage);
      await page.close();
    }

    this.contexts.set(key, context);
    console.log(`[Playwright] Context created: ${key}`);
    return context;
  }

  async getPage(session: PlatformSession): Promise<Page> {
    const context = await this.getContext(session);
    return await context.newPage();
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

export function getPlaywrightManager(): PlaywrightManager {
  return new PlaywrightManager();
}
