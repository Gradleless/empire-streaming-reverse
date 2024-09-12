import { NextRequest, NextResponse } from 'next/server';

const rateLimit = new Map<string, { count: number; lastRequest: number }>();
const LIMIT = 7;
const TIME_FRAME = 5000;

export function rateLimitMiddleware(req: NextRequest) {
  const ip = req.ip || '127.0.0.1';
  const currentTime = Date.now();

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, lastRequest: currentTime });
  } else {
    const userData = rateLimit.get(ip);
    if (userData === undefined)
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 404 }
      );

    if (currentTime - userData.lastRequest < TIME_FRAME) {
      userData.count += 1;

      if (userData.count > LIMIT) {
        return NextResponse.json(
          { error: 'api moved to /v1.5' },
          { status: 429 }
        );
      }
    } else {
      userData.count = 1;
      userData.lastRequest = currentTime;
    }
  }

  return NextResponse.json({ message: 'Request allowed' }, { status: 200 });
}
