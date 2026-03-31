import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { platforms } from '@/lib/db/schema';
import { getCDPBridge } from '@/lib/cdp/bridge';
import { encrypt } from '@/lib/utils/crypto';
import { eq } from 'drizzle-orm';
import { getAdapter } from '@/app/api/_lib/registry';

const platformDomains: Record<string, string[]> = {
  twitter: ['x.com', 'twitter.com'],
  jike: ['web.okjike.com', 'okjike.com'],
  linkedin: ['www.linkedin.com', 'linkedin.com'],
  weibo: ['weibo.com', 'www.weibo.com'],
  xiaohongshu: ['www.xiaohongshu.com', 'xiaohongshu.com'],
};

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const platformId = params.id;
    const [platform] = await db.select().from(platforms).where(eq(platforms.id, platformId)).limit(1);
    
    if (!platform) {
      return NextResponse.json({ error: 'Platform not found' }, { status: 404 });
    }

    const domains = platformDomains[platform.name];
    if (!domains) {
      return NextResponse.json({ error: 'Unknown platform' }, { status: 400 });
    }

    const bridge = getCDPBridge();
    const connected = await bridge.connect();
    
    if (!connected) {
      return NextResponse.json(
        { error: 'Cannot connect to Chrome. Make sure Chrome is running with --remote-debugging-port=9222' },
        { status: 503 }
      );
    }

    const session = await bridge.extractSession(platform.name, domains);
    await bridge.disconnect();

    if (!session) {
      return NextResponse.json(
        { error: 'No session found. Please login to the platform in Chrome first.' },
        { status: 404 }
      );
    }

    const adapter = getAdapter(platform.name);
    let isValid = false;
    
    if (adapter) {
      try {
        isValid = await adapter.validateSession(session);
      } catch (e) {
        console.error('[Session] Validation failed:', e);
      }
    }

    const encryptedSession = encrypt(JSON.stringify(session));
    
    await db.update(platforms)
      .set({ sessionData: encryptedSession, sessionValid: isValid, updatedAt: new Date() })
      .where(eq(platforms.id, platformId));

    return NextResponse.json({
      success: true,
      valid: isValid,
      message: isValid ? 'Session refreshed successfully' : 'Session saved but validation failed',
    });
  } catch (error) {
    console.error('[Session] Refresh failed:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const platformId = params.id;
    const [platform] = await db.select().from(platforms).where(eq(platforms.id, platformId)).limit(1);
    
    if (!platform) {
      return NextResponse.json({ error: 'Platform not found' }, { status: 404 });
    }

    return NextResponse.json({
      valid: platform.sessionValid,
      lastSyncAt: platform.lastSyncAt,
      hasSession: !!platform.sessionData,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
