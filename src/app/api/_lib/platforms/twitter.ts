import {
  PlatformAdapter,
  PlatformSession,
  PostContent,
  PostResult,
  FeedResult,
  NotificationResult,
  SearchResult,
  UserProfile,
} from '@/lib/platforms/adapter';
import { getBrowserManager, BrowserPage } from '@/lib/browser';

export class TwitterAdapter implements PlatformAdapter {
  name = 'twitter' as const;
  displayName = 'Twitter / X';
  icon = '𝕏';
  color = '#1D9BF0';

  private domains = ['x.com', 'twitter.com'];

  private async getPage(session: PlatformSession): Promise<BrowserPage> {
    const manager = getBrowserManager();
    return await manager.getPage(session);
  }

  async validateSession(session: PlatformSession): Promise<boolean> {
    try {
      const page = await this.getPage(session);
      await page.goto('https://x.com/home', { waitUntil: 'networkidle' });
      const isLoggedIn = await page.locator('[data-testid="primaryColumn"] [data-testid="SideNav_AccountSwitcher_Button"]').count() > 0;
      await page.close();
      return isLoggedIn;
    } catch (error) {
      console.error('[Twitter] Session validation failed:', error);
      return false;
    }
  }

  async getFeed(session: PlatformSession, cursor?: string): Promise<FeedResult> {
    try {
      const page = await this.getPage(session);
      const url = cursor ? `https://x.com/home` : 'https://x.com/home';
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);

      const tweets = await page.evaluate(() => {
        const results: any[] = [];
        document.querySelectorAll('article[data-testid="tweet"]').forEach((el) => {
          try {
            const authorLink = el.querySelector('a[href^="/"][role="link"]');
            const authorHref = authorLink?.getAttribute('href') || '';
            const handle = authorHref.split('/')[1] || '';
            const name = el.querySelector('[data-testid="User-Name"]')?.textContent?.split('@')[0]?.trim() || '';
            const avatar = el.querySelector('img[src*="profile_images"]')?.getAttribute('src') || '';
            const text = el.querySelector('[data-testid="tweetText"]')?.textContent || '';
            
            const getStat = (testId: string) => {
              const statEl = el.querySelector(`[data-testid="${testId}"]`);
              const text = statEl?.textContent || '0';
              return parseInt(text.replace(/[^0-9]/g, '')) || 0;
            };

            const timeEl = el.querySelector('time');
            const tweetLink = el.querySelector('a[href*="/status/"]');
            const href = tweetLink?.getAttribute('href') || '';

            results.push({
              id: href.split('/status/')[1]?.split('?')[0] || Math.random().toString(36),
              platform: 'twitter',
              author: { id: handle, name, handle: `@${handle}`, avatar, verified: false, platform: 'twitter' },
              content: { text },
              stats: { likes: getStat('like'), reposts: getStat('retweet'), comments: getStat('reply') },
              interactions: { liked: false, reposted: false, bookmarked: false },
              createdAt: timeEl?.getAttribute('datetime') || new Date().toISOString(),
              url: `https://x.com${href}`,
            });
          } catch (e) {}
        });
        return results;
      });

      await page.close();
      return { items: tweets, hasMore: tweets.length > 0 };
    } catch (error) {
      console.error('[Twitter] Feed fetch failed:', error);
      return { items: [], hasMore: false };
    }
  }

  async getNotifications(session: PlatformSession): Promise<NotificationResult> {
    try {
      const page = await this.getPage(session);
      await page.goto('https://x.com/notifications', { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);

      const notifications = await page.evaluate(() => {
        const results: any[] = [];
        document.querySelectorAll('[data-testid="cellInnerDiv"]').forEach((el, index) => {
          const text = el.textContent || '';
          let type: any = 'like';
          if (text.includes('reposted')) type = 'repost';
          else if (text.includes('liked')) type = 'like';
          else if (text.includes('replied')) type = 'comment';
          else if (text.includes('followed')) type = 'follow';

          results.push({
            id: `notif_${index}`,
            platform: 'twitter',
            type,
            actor: { name: el.querySelector('span')?.textContent?.split(' ')[0] || '', handle: '', avatar: el.querySelector('img')?.getAttribute('src') || '' },
            content: text.slice(0, 100),
            originalUrl: 'https://x.com/notifications',
            read: true,
            createdAt: new Date().toISOString(),
          });
        });
        return results;
      });

      await page.close();
      return { items: notifications, hasMore: false };
    } catch (error) {
      return { items: [], hasMore: false };
    }
  }

  async createPost(content: PostContent, session: PlatformSession): Promise<PostResult> {
    return { success: false, error: 'Not implemented' };
  }

  async getPost(postId: string, session: PlatformSession): Promise<any> {
    return null;
  }

  async likePost(postId: string, session: PlatformSession): Promise<void> {
    const page = await this.getPage(session);
    await page.goto(`https://x.com/i/status/${postId}`, { waitUntil: 'networkidle' });
    await page.locator('[data-testid="like"]').first().click();
    await page.waitForTimeout(1000);
    await page.close();
  }

  async repostPost(postId: string, session: PlatformSession): Promise<void> {
    const page = await this.getPage(session);
    await page.goto(`https://x.com/i/status/${postId}`, { waitUntil: 'networkidle' });
    await page.locator('[data-testid="retweet"]').first().click();
    await page.locator('[data-testid="retweetConfirm"]').first().click();
    await page.waitForTimeout(1000);
    await page.close();
  }

  async commentOnPost(postId: string, content: string, session: PlatformSession): Promise<void> {
    const page = await this.getPage(session);
    await page.goto(`https://x.com/i/status/${postId}`, { waitUntil: 'networkidle' });
    await page.locator('[data-testid="reply"]').first().click();
    await page.locator('[data-testid="tweetTextarea_0"]').fill(content);
    await page.locator('[data-testid="tweetButton"]').first().click();
    await page.waitForTimeout(2000);
    await page.close();
  }

  async search(query: string, session: PlatformSession): Promise<SearchResult> {
    return { items: [], hasMore: false };
  }

  async getProfile(userId: string, session: PlatformSession): Promise<UserProfile> {
    return { id: userId, name: '', handle: '', avatar: '' };
  }

  getDomains(): string[] {
    return this.domains;
  }
}