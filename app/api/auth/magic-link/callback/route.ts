import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.redirect(new URL('/auth/magic-link-invalid', request.url));
        }

        // Forward to the backend for verification
        const backendUrl = `${process.env.BACKEND_API_URL}/api/auth/magic-link/callback/?token=${token}`;

        // We need to handle the redirect from the backend
        // Instead of making a fetch request, we'll redirect to the backend URL
        // The backend will then redirect back to our frontend success/error pages

        return NextResponse.redirect(backendUrl);
    } catch (error) {
        console.error('Error processing magic link callback:', error);
        return NextResponse.redirect(new URL('/auth/magic-link-invalid', request.url));
    }
}