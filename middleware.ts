import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // 🔐 Check Supabase session cookie
  const hasAuth =
    request.cookies.get('sb-access-token') ||
    request.cookies.get('sb:token');

  // ❌ NOT LOGGED IN → BLOCK
  if (!hasAuth) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};