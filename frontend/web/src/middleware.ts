import { NextRequest, NextResponse } from 'next/server';

// Routes that don't require authentication
const publicRoutes = [
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
    '/',
    '/collections',
    '/products',
    '/contact',
];

// Routes that require authentication
const protectedRoutes = [
    '/dashboard',
    '/addresses',
    '/orders',
    '/cart',
    '/checkout',
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get token from cookies or localStorage (cookies are more secure)
    const token = request.cookies.get('token')?.value;
    const userId = request.cookies.get('userId')?.value;

    const isAuthenticated = !!token && !!userId;

    // Check if the route is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route),
    );

    // Check if the route is public
    const isPublicRoute = publicRoutes.some((route) =>
        pathname === route || pathname.startsWith(route),
    );

    // If trying to access protected route without auth, redirect to signin
    if (isProtectedRoute && !isAuthenticated) {
        const signInUrl = new URL('/auth/signin', request.url);
        signInUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(signInUrl);
    }

    // If trying to access auth pages while authenticated, redirect to dashboard
    if (
        (pathname === '/auth/signin' || pathname === '/auth/signup') &&
        isAuthenticated
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Add user info to response headers for use in components via cookies
    const response = NextResponse.next();

    if (isAuthenticated) {
        response.headers.set('X-User-ID', userId);
    }

    return response;
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
