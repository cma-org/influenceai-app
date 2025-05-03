import { NextRequest, NextResponse } from 'next/server';
import { setServerAuthToken, setServerUserType } from '@/app/lib/utils/server-cookies';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("complete: body", body);
        const {
            access_token,
            page_id,
            page_name,
            page_access_token,
            instagram_business_account_id,
            user_type
        } = body;

        // Validate all required fields
        if (!access_token || !page_id || !page_access_token || !instagram_business_account_id) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Save user type if provided
        if (user_type) {
            setServerUserType(user_type);
        }

        // Send data to backend for authentication
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
        const backendResponse = await fetch(`${backendUrl}/api/auth/facebook/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_token,
                page_id,
                page_name,
                page_access_token,
                instagram_business_account_id,
                user_type: user_type || 'brand'
            }),
        });

        if (!backendResponse.ok) {
            const errorData = await backendResponse.json();
            return NextResponse.json(
                { error: errorData.error || 'Authentication failed' },
                { status: backendResponse.status }
            );
        }

        // Get authentication token from backend
        const backendData = await backendResponse.json();
        const jwt = backendData.access_token || backendData.token.access_token;
        console.log("jwt: ", jwt)

        if (!jwt) {
            return NextResponse.json(
                { error: 'No authentication token received from backend' },
                { status: 500 }
            );
        }

        // Set the auth token in server cookies
        setServerAuthToken(jwt);

        // Set client-accessible token
        const cookieStore = request.cookies;
        const response = NextResponse.json({ success: true });

        response.cookies.set({
            name: 'auth_token_client',
            value: jwt,
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        console.log("response:", response)

        return response;
    } catch (error) {
        console.error('Error completing authentication:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}