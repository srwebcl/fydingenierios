import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || 'default_secret_key_12345';
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/admin-panel') && path !== '/admin-panel/login') {
    const session = request.cookies.get('fyd_admin_session')?.value;
    
    if (!session) {
      return NextResponse.redirect(new URL('/admin-panel/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(session, key);
      
      // RBAC Check
      const role = payload.role as string;
      const permissions = payload.permissions as string[];
      
      // If SELLER, restrict access to configuracion and usuarios
      if (role === 'SELLER') {
        if (path.startsWith('/admin-panel/configuracion') || path.startsWith('/admin-panel/usuarios')) {
          return NextResponse.redirect(new URL('/admin-panel', request.url));
        }
        
        // Modules permission checks
        if (path.startsWith('/admin-panel/cotizaciones') && !permissions.includes('ALL') && !permissions.includes('comercial')) {
          return NextResponse.redirect(new URL('/admin-panel', request.url));
        }
        if (path.startsWith('/admin-panel/capacitaciones') && !permissions.includes('ALL') && !permissions.includes('cursos')) {
          return NextResponse.redirect(new URL('/admin-panel', request.url));
        }
        if (path.startsWith('/admin-panel/credenciales') && !permissions.includes('ALL') && !permissions.includes('diplomas')) {
          return NextResponse.redirect(new URL('/admin-panel', request.url));
        }
        if (path.startsWith('/admin-panel/informes') && !permissions.includes('ALL') && !permissions.includes('informes')) {
          return NextResponse.redirect(new URL('/admin-panel', request.url));
        }
        if (path.startsWith('/admin-panel/leads') && !permissions.includes('ALL') && !permissions.includes('leads')) {
          return NextResponse.redirect(new URL('/admin-panel', request.url));
        }
      }

    } catch (err) {
      // Invalid token
      return NextResponse.redirect(new URL('/admin-panel/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/admin-panel/:path*',
};
