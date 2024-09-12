import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { getData } from '@/lib/empire-streaming';
import { rateLimitMiddleware } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const referer = request.headers.get('referer');
  const timestamp = request.headers.get('x');
  const signature = request.headers.get('s') || '';

  const response = rateLimitMiddleware(request);
  if (response.status !== 200) {
    return response;
  }

  const validReferer = 'https://empire-streaming-bypasser.vercel.app/';
  if (!referer?.startsWith(validReferer)) {
    return NextResponse.json({ error: 'api moved to /v1.5' }, { status: 403 });
  }

  const currentTime = Date.now();
  const requestTime = parseInt(timestamp || '0', 10);
  if (isNaN(requestTime) || currentTime - requestTime > 10000) {
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
