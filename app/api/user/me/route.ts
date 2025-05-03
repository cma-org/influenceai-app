import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];

        // Call the backend API to get user data
        const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/user/me/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!backendResponse.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch user data' },
                { status: backendResponse.status }
            );
        }

        const userData = await backendResponse.json();
        return NextResponse.json(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}