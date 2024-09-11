import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { getData } from '@/lib/empire-streaming';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const referer = request.headers.get('referer');
  const timestamp = request.headers.get('x-timestamp');
  const signature = request.headers.get('x-signature') || '';

  const validReferer = 'http://localhost:3000/';

  if (!referer?.startsWith(validReferer)) {
    return NextResponse.json({ error: 'api moved to /v1.5' }, { status: 403 });
  }

  const currentTime = Date.now();
  const requestTime = parseInt(timestamp || '0', 10);
  if (isNaN(requestTime) || currentTime - requestTime > 10000) {
    // 10 seconds max lol
    return NextResponse.json({ error: 'api moved to /v1.5' }, { status: 400 });
  }

  const id = searchParams.get('id');
  const type = searchParams.get('type');

  if (!id || !type) {
    return NextResponse.json({ error: 'missing id or type' }, { status: 400 });
  }

  if (
    signature !=
    crypto
      .createHash('sha256')
      .update('***REMOVED***:getData:' + timestamp + ':' + id + ':' + type)
      .digest('hex')
  ) {
    return NextResponse.json({ error: 'api moved to /v1.5' }, { status: 403 });
  }

  const items = await getData(Number(id), type);
  return NextResponse.json(items);
}
