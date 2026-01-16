import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const { code } = await req.json();

  if (code === process.env.ACCESS_CODE) {
    cookies().set('auth_session', 'true', { 
      httpOnly: true, 
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 Days
    });
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json({ error: 'Invalid' }, { status: 401 });
}
