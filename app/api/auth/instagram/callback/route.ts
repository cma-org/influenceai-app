// app/api/auth/instagram/callback/route.ts

import { NextRequest, NextResponse } from 'next/server';

// This is a separate route handler for the GET request that receives the code from Instagram
export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    // Get the user type from the cookie
    const userType = req.cookies.get('user_type')?.value;

    if (error) {
        // Redirect to auth page with error
        return NextResponse.redirect(new URL(`/auth?error=${error}`, req.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL('/auth?error=missing_code', req.url));
    }

    if (!userType) {
        return NextResponse.redirect(new URL('/user-type-selection', req.url));
    }

    try {
        console.log('Received code from Instagram, processing...');

        // Make a request to our own API route
        const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/auth/instagram/callback/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, userType }),
        });

        if (!response.ok) {
            console.error('Error from backend:', response.status);
            const error = await response.json();
            return NextResponse.redirect(new URL(`/auth?error=${error.message || 'authentication_failed'}`, req.url));
        }

        const data = await response.json();
        console.log('Received data from backend:', data);
        const token = data.token.access;
        console.log('Received token from backend:', token);
        console.log('setting cookie...');

        // Create response with redirect
        const redirectUrl = new URL('/dashboard', req.url);
        const response_with_cookie = NextResponse.redirect(redirectUrl);

        // Set cookie with proper attributes to ensure it's accessible
        response_with_cookie.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // Important for OAuth flows
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        });

        // Also set a non-httpOnly cookie for client-side access
        // (This is needed because http-only cookies aren't accessible to JavaScript)
        response_with_cookie.cookies.set({
            name: 'auth_token_client',
            value: token,
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        });

        console.log('Redirect response created, cookies set');
        return response_with_cookie;
    } catch (error) {
        console.error('Error handling Instagram callback:', error);
        return NextResponse.redirect(new URL('/auth?error=server_error', req.url));
    }
}