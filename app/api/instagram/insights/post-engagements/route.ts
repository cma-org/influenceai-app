// app/api/instagram/insights/post-engagements/route.ts
import { NextResponse } from 'next/server';
import { getServerAuthToken } from '@/app/lib/utils/server-cookies';

export async function GET(request: Request) {
    try {
        const token = await getServerAuthToken();

        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Get months parameter from URL if provided
        const { searchParams } = new URL(request.url);
        const months = searchParams.get('months');
        const queryParams = months ? `?months=${months}` : '';

        const response = await fetch(`${process.env.BACKEND_API_URL}/api/instagram/insights/post-engagements/${queryParams}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: errorData.error || 'Failed to fetch post engagements data' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching post engagements data:', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}