// app/api/instagram/insights/demographics/route.ts
import { NextResponse } from 'next/server';
import { getServerAuthToken } from '@/app/lib/utils/server-cookies';

export async function GET() {
    try {
        const token = await getServerAuthToken();

        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const response = await fetch(`${process.env.BACKEND_API_URL}/api/instagram/insights/demographics/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: errorData.error || 'Failed to fetch demographic insights' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching demographic insights:', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}