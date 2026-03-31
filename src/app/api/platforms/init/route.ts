import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { platforms } from '@/lib/db/schema';

const defaultPlatforms = [
  {
    id: 'twitter',
    name: 'twitter',
    displayName: 'Twitter / X',
    enabled: true,
    sessionValid: false,
  },
  {
    id: 'jike',
    name: 'jike',
    displayName: '即刻',
    enabled: true,
    sessionValid: false,
  },
  {
    id: 'linkedin',
    name: 'linkedin',
    displayName: 'LinkedIn',
    enabled: true,
    sessionValid: false,
  },
  {
    id: 'weibo',
    name: 'weibo',
    displayName: '微博',
    enabled: true,
    sessionValid: false,
  },
  {
    id: 'xiaohongshu',
    name: 'xiaohongshu',
    displayName: '小红书',
    enabled: false,
    sessionValid: false,
  },
];

export async function POST() {
  try {
    let added = 0;
    for (const platform of defaultPlatforms) {
      try {
        await db.insert(platforms).values(platform);
        added++;
      } catch (e) {
        // Already exists
      }
    }
    return NextResponse.json({ success: true, added });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allPlatforms = await db.select().from(platforms);
    return NextResponse.json({ platforms: allPlatforms });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
