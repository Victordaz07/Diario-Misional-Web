import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Rutas públicas que no requieren autenticación
    const publicRoutes = ['/login', '/register', '/'];

    // Si es una ruta pública, permitir acceso
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // Para todas las demás rutas, verificar si hay token de autenticación
    const token = request.cookies.get('auth-token');

    if (!token) {
        // Redirigir a login si no hay token
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
