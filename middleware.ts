import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    console.log('Middleware: Processing request for', pathname);

    // Rutas públicas que no requieren autenticación
    const publicRoutes = ['/login', '/register', '/'];

    // Si es una ruta pública, permitir acceso
    if (publicRoutes.includes(pathname)) {
        console.log('Middleware: Public route, allowing access');
        return NextResponse.next();
    }

    // En modo de desarrollo, permitir acceso a todas las rutas
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
        console.log('Middleware: Development mode - allowing access to', pathname);
        return NextResponse.next();
    }

    // En producción, si Firebase no está configurado, permitir acceso
    if (process.env.NODE_ENV === 'production' &&
        (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
            process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'demo-api-key-for-development')) {
        console.log('Middleware: Production without Firebase - allowing access to', pathname);
        return NextResponse.next();
    }

    // Para todas las demás rutas, verificar si hay token de autenticación
    const token = request.cookies.get('auth-token');

    if (!token) {
        console.log('Middleware: No token found, redirecting to login');
        // Redirigir a login si no hay token
        return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log('Middleware: Token found, allowing access');
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
