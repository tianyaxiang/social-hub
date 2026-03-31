import { BrowserManager, PlatformSession } from './types';
import { getCDPBrowserManager } from './cdp';
import { getPlaywrightBrowserManager } from './playwright';

export type BrowserMode = 'cdp' | 'playwright';

export function getBrowserMode(): BrowserMode {
  return (process.env.BROWSER_MODE as BrowserMode) || 'playwright';
}

export function setBrowserMode(mode: BrowserMode): void {
  process.env.BROWSER_MODE = mode;
}

export function getBrowserManager(): BrowserManager {
  const mode = getBrowserMode();
  
  switch (mode) {
    case 'cdp':
      console.log('[BrowserFactory] Using CDP mode');
      return getCDPBrowserManager();
    case 'playwright':
    default:
      console.log('[BrowserFactory] Using Playwright mode');
      return getPlaywrightBrowserManager();
  }
}

// Re-export types
export type { BrowserManager, BrowserPage, BrowserLocator, PlatformSession } from './types';