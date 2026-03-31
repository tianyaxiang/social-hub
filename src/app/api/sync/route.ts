import { NextRequest, NextResponse } from 'next/server';
import { getSyncService } from '@/app/api/_lib/sync';
import { db } from '@/lib/db';
import { platforms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { platformId, type } = await request.json();
    const syncService = getSyncService();

    if (platformId) {
      if (type === 'notifications') {
        const result = await syncService.syncNotifications(platformId);
        return NextResponse.json({ platformId, type: 'notifications', ...result });
      } else {
        const result = await syncService.syncFeed(platformId);
        return NextResponse.json({ platformId, type: 'feed', ...result });
      }
    } else {
      // Sync all platforms
      const allPlatforms = await db.select().from(platforms);
      const results: Record<string, any> = {};
      
      for (const platform of allPlatforms) {
        if (!platform.enabled) continue;
        const feedResult = await syncService.syncFeed(platform.id);
        const notifResult = await syncService.syncNotifications(platform.id);
        results[platform.id] = {
          feed: feedResult.added,
          notifications: notifResult.added,
          error: feedResult.error || notifResult.error,
        };
      }
      
      return NextResponse.json({ results });
    }
  } catch (error) {
    console.error('[Sync] Failed:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allPlatforms = await db.select().from(platforms);
    return NextResponse.json({
      platforms: allPlatforms.map(p => ({
        id: p.id,
        name: p.name,
        enabled: p.enabled,
        sessionValid: p.sessionValid,
        lastSyncAt: p.lastSyncAt,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
