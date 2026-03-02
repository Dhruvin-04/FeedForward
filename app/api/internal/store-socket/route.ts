import { NextResponse } from 'next/server';
import { storeSocket } from '@/app/actions';

export async function POST(req: Request) {
  const secret = req.headers.get('x-internal-secret');
  if (secret !== process.env.INTERNAL_SECRET) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch (err) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  const { userId, socketId } = body ?? {};
  if (!userId || !socketId) {
    return new NextResponse('Missing fields', { status: 400 });
  }

  try {
    await storeSocket({ userId, socketId });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('error in /api/internal/store-socket', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
