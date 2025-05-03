// app/api/auth/facebook/token-exchange/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { setServerAuthToken, setServerUserType } from '@/app/lib/utils/server-cookies';

export async function POST(request: NextRequest) {
    try {
        const { accessToken } = await request.json();

        if (!accessToken) {
            return NextResponse.json({
                success: false,
                message: 'Access token is required'
            }, { status: 400 });
        }

        // Exchange the Facebook token for a JWT token with the backend API
        const response = await fetch(`${process.env.BACKEND_API_URL}/api/auth/facebook/exchange-token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ access_token: accessToken })
        });

        // Handle API errors
        if (!response.ok) {
            let errorMessage = 'Failed to authenticate with the server';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // If JSON parsing fails, use the default error message
            }

            return NextResponse.json({
                success: false,
                message: errorMessage
            }, { status: response.status });
        }

        // Parse successful response
        const data = await response.json();

        // Set server-side HTTP-only cookies with the JWT token
        await setServerAuthToken(data.token);
        await setServerUserType('brand');

        // Return the user data and token for client-side use
        return NextResponse.json({
            success: true,
            token: data.token,
            user: data.user
        });

    } catch (error) {
        console.error('Error in Facebook token exchange:', error);
        return NextResponse.json({
            success: false,
            message: 'Server error during authentication process'
        }, { status: 500 });
    }
}