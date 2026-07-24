import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.startsWith('/admin-panel') && path !== '/admin-panel/login') {
    const session = request.cookies.get('fyd_admin_session');
    if (!session || session.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin-panel/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/admin-panel/:path*',
};
