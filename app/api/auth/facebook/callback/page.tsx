// app/api/auth/facebook/callback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthToken, setUserType } from '@/app/lib/utils/cookies';

export default function FacebookCallbackHandler() {
    const router = useRouter();
    const [status, setStatus] = useState<string>('Processing your authentication...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function processAuthCallback() {
            try {
                // Extract the hash fragment from the URL
                const hash = window.location.hash.substring(1);

                // Parse the hash fragment into an object
                const params = new URLSearchParams(hash);
                const accessToken = params.get('access_token');
                const dataAccessExpirationTime = params.get('data_access_expiration_time');
                const expiresIn = params.get('expires_in');
                const longlived_accessToken = params.get('longlived_access_token');
                console.log("longlived: ", longlived_accessToken)

                // Validate the token presence
                if (!accessToken) {
                    setError('No access token found in the callback URL. Please try again.');
                    return;
                }

                setStatus('Authenticating with server...');

                // Exchange the token for a JWT token from our backend
                const response = await fetch('/api/auth/facebook/exchange-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ accessToken }),
                });

                const data = await response.json();
                console.log("data: ", data)

                if (data.success) {
                    // Store the JWT token in client-side cookie for API requests
                    setAuthToken(data.token);
                    setUserType('brand'); // Set user type for brand accounts

                    setStatus('Authentication successful! Redirecting to dashboard...');

                    // Small delay for better user experience
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 500);
                } else {
                    setError(data.message || 'Authentication failed. Please try again.');
                }
            } catch (error) {
                console.error('Error processing Facebook callback:', error);
                setError('An unexpected error occurred during authentication.');
            }
        }

        processAuthCallback();
    }, [router]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-indigo-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-indigo-600">
                        Instagram Business Authentication
                    </h2>

                    {error ? (
                        <div className="mt-4 p-4 bg-red-50 rounded-md">
                            <p className="text-md text-red-600">{error}</p>
                            <button
                                onClick={() => router.push('/auth')}
                                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="mt-4">
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                            <p className="mt-4 text-md text-gray-600">{status}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}