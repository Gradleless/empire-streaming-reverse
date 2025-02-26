import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { getItems } from '@/lib/empire-streaming';
import { rateLimitMiddleware } from '@/lib/middleware';
// useless now
export async function GET(request: NextRequest) {
  const referer = request.headers.get('referer');
  const timestamp = request.headers.get('x');

  const response = rateLimitMiddleware(request);
  if (response.status !== 200) {
    return response;
  }

  const validReferer = 'https://empire-streaming-bypasser.vercel.app/';
  if (!referer?.startsWith(validReferer)) {
    return NextResponse.json({ error: 'api moved to /v1.5' }, { status: 403 });
  }

  if (!request.headers.get('s')) {
    return NextResponse.json({ error: 'api moved to /v1.5' }, { status: 403 });
  }

  if (!timestamp) {
    return NextResponse.json({ error: 'api moved to /v1.5' }, { status: 403 });
  }

  if (
    crypto
      .createHash('sha256')
      .update('deletedpedo:getItems:' + timestamp)
      .digest('hex') != request.headers.get('s')
  ) {
    return NextResponse.json({ error: 'api moved to /v1.5' }, { status: 403 });
  }

  const currentTime = Date.now();
  const requestTime = parseInt(timestamp || '0', 10);
  if (isNaN(requestTime) || currentTime - requestTime > 10000) {
    return NextResponse.json({ error: 'api moved to /v1.5' }, { status: 400 });
  }

  const items = await getItems();
  const newItems = [...items.films, ...items.series];
  return NextResponse.json(newItems);
}
