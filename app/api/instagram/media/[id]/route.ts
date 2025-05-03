import * as React from 'react'
import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthToken } from '@/app/lib/utils/server-cookies';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = await getServerAuthToken();
        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const mediaId = params.id;
        if (!mediaId) {
            return NextResponse.json(
                { error: 'Media ID is required' },
                { status: 400 }
            );
        }

        // Forward the request to the backend
        const backendUrl = `${process.env.BACKEND_API_URL}/api/instagram/media/${mediaId}`;
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
        console.error(`Error fetching Instagram media ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch media details' },
            { status: 500 }
        );
    }
}