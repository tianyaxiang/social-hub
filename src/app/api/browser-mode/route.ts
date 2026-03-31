import { NextRequest, NextResponse } from 'next/server';
import { getBrowserMode, setBrowserMode, BrowserMode } from '@/lib/browser';

export async function GET() {
  return NextResponse.json({
    mode: getBrowserMode(),
    available: ['cdp', 'playwright'],
    description: {
      cdp: 'Use existing Chrome via DevTools Protocol (reuses logged-in sessions)',
      playwright: 'Use headless Playwright browser (isolated, requires stored sessions)',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { mode } = await request.json();
    
    if (!mode || !['cdp', 'playwright'].includes(mode)) {
      return NextResponse.json(
        { error: "Invalid mode. Use 'cdp' or 'playwright'" },
        { status: 400 }
      );
    }
    
    setBrowserMode(mode as BrowserMode);
    
    return NextResponse.json({
      success: true,
      mode: getBrowserMode(),
      message: `Browser mode switched to: ${mode}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}