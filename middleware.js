import { NextResponse } from 'next/server';

// First line of defence: no token cookie -> redirect to /login.
// The API still verifies every request, so this is UX + routing, not the security boundary.
export function middleware(req) {
  const token = req.cookies.get('dt_token')?.value;
  const { pathname } = req.nextUrl;
  const isLogin = pathname.startsWith('/login');

  if (!token && !isLogin) {
    const url = new URL('/login', req.url);
    if (pathname !== '/') url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  if (token && (isLogin || pathname === '/')) return NextResponse.redirect(new URL('/dashboard', req.url));
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'] };
