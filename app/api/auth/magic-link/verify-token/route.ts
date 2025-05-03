// app/api/auth/verify-token/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();

    const response = await fetch(`${process.env.BACKEND_API_URL}/api/auth/magic-link/verify/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}