import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthToken } from '@/app/lib/utils/server-cookies';

export async function GET(request: NextRequest) {
    try {
        const token = await getServerAuthToken();
        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Extract cursor from query parameters if present
        const { searchParams } = new URL(request.url);
        const cursor = searchParams.get('cursor');

        // Build the backend API URL with cursor if provided
        let backendUrl = `${process.env.BACKEND_API_URL}/api/instagram/media`;
        if (cursor) {
            backendUrl += `?cursor=${cursor}`;
        }

        // Forward the request to the backend
        const response = await fetch(backendUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Backend error: ${response.statusText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching Instagram media:', error);
        return NextResponse.json(
            { error: 'Failed to fetch media' },
            { status: 500 }
        );
    }
}