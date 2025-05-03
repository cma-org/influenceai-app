// app/api/auth/instagram/authorize/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Construct the authorization URL
        const authorizationUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=1337163177321901&redirect_uri= https://localhost:3000/api/auth/instagram/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights`;

        return NextResponse.json({ authorizationUrl });
    } catch (error) {
        console.error('Failed to generate Instagram auth URL:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}