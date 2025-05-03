import { NextRequest, NextResponse } from 'next/server';
import { FACEBOOK_AUTH_CONFIG } from '@//app/config/facebook-auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { access_token } = body;
        console.log("accounts: " + access_token)

        if (!access_token) {
            return NextResponse.json(
                { error: 'Access token is required' },
                { status: 400 }
            );
        }

        // Fetch user's Facebook pages with Instagram business accounts
        const response = await fetch(
            `${FACEBOOK_AUTH_CONFIG.graphApiUrl}/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${access_token}`
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching Facebook pages:', errorData);
            return NextResponse.json(
                { error: 'Failed to fetch Facebook pages' },
                { status: 500 }
            );
        }

        const data = await response.json();
        console.log("accounts data", data)

        // Filter pages with connected Instagram business accounts
        const pagesWithInstagram = data.data.filter(
            (page: any) => page.instagram_business_account
        );

        if (pagesWithInstagram.length === 0) {
            return NextResponse.json(
                { accounts: [] },
                { status: 200 }
            );
        }

        // Format the account data
        const accounts = pagesWithInstagram.map((page: any) => ({
            pageId: page.id,
            pageName: page.name,
            pageAccessToken: page.access_token,
            instagramAccountId: page.instagram_business_account.id,
        }));
        console.log("formatted accounts", accounts)

        return NextResponse.json({ accounts });
    } catch (error) {
        console.error('Error processing accounts request:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}