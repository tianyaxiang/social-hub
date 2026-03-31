import { db } from '@/lib/db';
import { posts, notifications, platforms } from '@/lib/db/schema';
import { decrypt, isEncrypted } from '@/lib/utils/crypto';
import { eq } from 'drizzle-orm';
import { PlatformSession } from '@/lib/platforms/adapter';
import { getAdapter } from '@/app/api/_lib/registry';

export class SyncService {
  async syncFeed(platformId: string): Promise<{ added: number; error?: string }> {
    try {
      const [platform] = await db.select().from(platforms).where(eq(platforms.id, platformId)).limit(1);
      
      if (!platform || !platform.enabled || !platform.sessionValid) {
        return { added: 0, error: 'Platform not available' };
      }

      const adapter = getAdapter(platform.name);
      if (!adapter) {
        return { added: 0, error: 'Adapter not found' };
      }

      let session: PlatformSession;
      try {
        const sessionData = platform.sessionData;
        if (!sessionData) return { added: 0, error: 'No session data' };
        const decrypted = isEncrypted(sessionData) ? decrypt(sessionData) : sessionData;
        session = JSON.parse(decrypted);
      } catch (error) {
        return { added: 0, error: 'Failed to decrypt session' };
      }

      const result = await adapter.getFeed(session);
      
      let added = 0;
      for (const item of result.items) {
        try {
          await db.insert(posts).values({
            id: `${platformId}_${item.id}`,
            platformId: platformId,
            platformPostId: item.id,
            authorName: item.author?.name,
            authorHandle: item.author?.handle,
            authorAvatar: item.author?.avatar,
            authorVerified: item.author?.verified || false,
            content: item.content?.text,
            media: item.content?.media ? JSON.stringify(item.content.media) : null,
            stats: JSON.stringify(item.stats),
            interactions: JSON.stringify(item.interactions),
            originalUrl: item.url,
            createdAt: new Date(item.createdAt),
          }).onConflictDoNothing();
          added++;
        } catch (e) {}
      }

      await db.update(platforms).set({ lastSyncAt: new Date() }).where(eq(platforms.id, platformId));
      return { added };
    } catch (error) {
      console.error(`[Sync] Failed to sync feed:`, error);
      return { added: 0, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async syncNotifications(platformId: string): Promise<{ added: number; error?: string }> {
    try {
      const [platform] = await db.select().from(platforms).where(eq(platforms.id, platformId)).limit(1);
      
      if (!platform || !platform.enabled || !platform.sessionValid) {
        return { added: 0, error: 'Platform not available' };
      }

      const adapter = getAdapter(platform.name);
      if (!adapter) return { added: 0, error: 'Adapter not found' };

      let session: PlatformSession;
      try {
        const sessionData = platform.sessionData;
        if (!sessionData) return { added: 0, error: 'No session data' };
        const decrypted = isEncrypted(sessionData) ? decrypt(sessionData) : sessionData;
        session = JSON.parse(decrypted);
      } catch (error) {
        return { added: 0, error: 'Failed to decrypt session' };
      }

      const result = await adapter.getNotifications(session);
      
      let added = 0;
      for (const item of result.items) {
        try {
          await db.insert(notifications).values({
            id: `${platformId}_${item.id}`,
            platformId: platformId,
            type: item.type,
            actorName: item.actor?.name,
            actorHandle: item.actor?.handle,
            actorAvatar: item.actor?.avatar,
            content: item.content,
            targetPostId: item.targetPostId,
            originalUrl: item.originalUrl,
            read: item.read,
            createdAt: new Date(item.createdAt),
          }).onConflictDoNothing();
          added++;
        } catch (e) {}
      }

      await db.update(platforms).set({ lastSyncAt: new Date() }).where(eq(platforms.id, platformId));
      return { added };
    } catch (error) {
      return { added: 0, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export function getSyncService(): SyncService {
  return new SyncService();
}
