// Abstract browser adapter interface
// Supports both CDP and Playwright modes

export interface BrowserPage {
  goto(url: string, options?: { waitUntil?: string }): Promise<void>;
  evaluate<T>(fn: () => T): Promise<T>;
  locator(selector: string): BrowserLocator;
  waitForTimeout(ms: number): Promise<void>;
  close(): Promise<void>;
}

export interface BrowserLocator {
  first(): BrowserLocator;
  click(): Promise<void>;
  fill(text: string): Promise<void>;
  count(): Promise<number>;
}

export interface BrowserContext {
  newPage(): Promise<BrowserPage>;
  addCookies(cookies: any[]): Promise<void>;
  close(): Promise<void>;
}

export interface PlatformSession {
  platformId: string;
  cookies: Record<string, string>;
  localStorage?: Record<string, string>;
  headers?: Record<string, string>;
  userAgent?: string;
  validUntil?: Date;
}

export interface BrowserManager {
  getPage(session?: PlatformSession): Promise<BrowserPage>;
  close(): Promise<void>;
}

// Mode configuration
export type BrowserMode = 'cdp' | 'playwright';

export function getBrowserMode(): BrowserMode {
  return (process.env.BROWSER_MODE as BrowserMode) || 'playwright';
}