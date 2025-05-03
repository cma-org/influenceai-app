// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check for authentication tokens - try both HTTP-only and client-accessible versions
    const token = request.cookies.get('auth_token')?.value;
    const tokenClient = request.cookies.get('auth_token_client')?.value;
    const isAuthenticated = !!token || !!tokenClient;

    const userType = request.cookies.get('user_type')?.value;
    const { pathname } = request.nextUrl;

    // Debug logging (will show in server logs)
    console.log(`Middleware path: ${pathname}, Auth: ${isAuthenticated}, UserType: ${userType}`);

    // If user is not authenticated and trying to access protected routes
    if (!isAuthenticated && pathname.startsWith('/dashboard')) {
        console.log('Redirecting unauthenticated user from dashboard to user-type-selection');
        return NextResponse.redirect(new URL('/user-type-selection', request.url));
    }

    // If user is authenticated but tries to access auth pages
    if (isAuthenticated && (pathname === '/auth' || pathname === '/user-type-selection')) {
        console.log('Redirecting authenticated user from auth pages to dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If user is accessing the home page and is not authenticated, redirect to user type selection
    if (pathname === '/' && !isAuthenticated) {
        console.log('Redirecting unauthenticated user from home to user-type-selection');
        return NextResponse.redirect(new URL('/user-type-selection', request.url));
    }

    // If user is accessing the home page and is authenticated, redirect to dashboard
    if (pathname === '/' && isAuthenticated) {
        console.log('Redirecting authenticated user from home to dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Allow callback routes to proceed regardless of authentication status
    if (pathname.startsWith('/api/auth/') && pathname.includes('/callback')) {
        console.log('Allowing access to callback route');
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/auth',
        '/user-type-selection',
        '/api/auth/:path*'
    ],
};