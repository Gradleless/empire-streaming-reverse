import { NextRequest, NextResponse } from 'next/server';

const rateLimit = new Map<string, { count: number; lastRequest: number }>();
const LIMIT = 3; // Max requests
const TIME_FRAME = 2000; // Time frame in milliseconds (1 minute)

export function rateLimitMiddleware(req: NextRequest) {
  const ip = req.ip || '127.0.0.1'; // Use IP address for rate limiting
  const currentTime = Date.now();

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, lastRequest: currentTime });
  } else {
    const userData = rateLimit.get(ip);
    if (userData === undefined) return NextResponse.next();

    if (currentTime - userData.lastRequest < TIME_FRAME) {
      userData.count += 1;

      if (userData.count > LIMIT) {
        return NextResponse.json(
          { error: 'api moved to /v1.5' },
          { status: 429 }
        );
      }
    } else {
      userData.count = 1; // Reset count after time frame
      userData.lastRequest = currentTime;
    }
  }

  return NextResponse.next();
}
