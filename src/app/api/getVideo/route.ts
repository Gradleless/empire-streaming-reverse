import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { getVideo } from '@/lib/empire-streaming';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  //const referer = request.headers.get('referer');
  const timestamp = request.headers.get('x-timestamp');
  const signature = request.headers.get('x-signature') || '';

  //const validReferer = 'http://localhost:3000/';

  /*
  if (!referer?.startsWith(validReferer)) {
    return NextResponse.json({ error: 'api moved to /v1.5' }, { status: 403 });
  }
    */

  const currentTime = Date.now();
  const requestTime = parseInt(timestamp || '0', 10);
  if (isNaN(requestTime) || currentTime - requestTime > 10000) {
    return NextResponse.json({ error: 'api moved to /v1.5' }, { status: 400 });
  }

  const id = searchParams.get('id');
  const type = searchParams.get('type');
  const episode = searchParams.get('episode');
  const season = searchParams.get('season');
  const vf = searchParams.get('vf') === 'true' ? true : false;

  if (!id || !type) {
    return NextResponse.json({ error: 'missing id or type' }, { status: 400 });
  }

  if (
    signature !=
    crypto
      .createHash('sha256')
      .update(
        'jaiplusdideeswsh:getVideo:' +
          timestamp +
          ':' +
          id +
          ':' +
          type +
          ':' +
          episode +
          ':' +
          season +
          ':' +
          vf
      )
      .digest('hex')
  ) {
    return NextResponse.json({ error: 'api moved to /v1.5' }, { status: 403 });
  }

  let items;
  if (episode == null || season == null) {
    items = await getVideo(Number(id), type, undefined, undefined, vf);
  } else {
    items = await getVideo(
      Number(id),
      type,
      Number(episode),
      Number(season),
      vf
    );
  }

  return NextResponse.json(items);
}
