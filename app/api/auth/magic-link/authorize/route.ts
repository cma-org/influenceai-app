// app/api/auth/magic-link/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { email, userType } = await request.json();
        console.log("post: ", email, userType);

        if (!email || !userType) {
            return NextResponse.json(
                { error: 'Email and user type are required' },
                { status: 400 }
            );
        }

        // Business email validation for brand users
        if (userType === 'brand') {
            const emailDomain = email.split('@')[1];
            const commonPersonalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];

            if (commonPersonalDomains.includes(emailDomain)) {
                return NextResponse.json(
                    { error: 'Please use a business email for brand accounts' },
                    { status: 400 }
                );
            }
        }

        console.log(`Sending magic link request to backend: ${process.env.BACKEND_API_URL}/api/auth/magic-link/request/`);

        // Call the backend API to request a magic link
        const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/auth/magic-link/request/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                user_type: userType
            }),
        });

        console.log(`Backend response status: ${backendResponse.status}`);

        const responseText = await backendResponse.text();
        console.log(`Backend response: ${responseText}`);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Error parsing JSON:', e);
            data = { error: 'Invalid response from backend' };
        }

        if (!backendResponse.ok) {
            return NextResponse.json(
                { error: data.error || `Failed to send magic link: ${backendResponse.status}` },
                { status: backendResponse.status }
            );
        }

        return NextResponse.json({ message: 'Magic link sent successfully' });
    } catch (error) {
        console.error('Error sending magic link:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}