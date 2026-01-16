import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const accessCode = request.cookies.get('access_code')?.value;

  // 1. Allow API routes and Static files to pass through without redirection
  if (path.startsWith('/api') || path.includes('_next') || path === '/favicon.ico') {
    return NextResponse.next();
  }

  // 2. Redirect to login if there is no access code and the user isn't on the login page
  if (!accessCode && path !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Redirect to home if user is logged in but tries to access login page
  if (accessCode && path === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// The matcher ensures middleware doesn't run on internal Next.js files
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
