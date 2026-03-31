import { NextRequest, NextResponse } from 'next/server';
import { checkCDPStatus, getCDPBridge } from '@/lib/cdp/bridge';

export async function GET() {
  const status = await checkCDPStatus();
  return NextResponse.json(status);
}

export async function POST(request: NextRequest) {
  try {
    const { host, port } = await request.json();
    const bridge = new (await import('@/lib/cdp/bridge')).CDPBridge({ host, port });
    const connected = await bridge.connect();
    
    if (connected) {
      await bridge.disconnect();
      return NextResponse.json({ connected: true });
    } else {
      return NextResponse.json(
        { connected: false, error: 'Failed to connect to Chrome' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { connected: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
