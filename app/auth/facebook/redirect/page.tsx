'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuthToken, setUserType } from '@/app/lib/utils/cookies';

export default function FacebookRedirect() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleRedirect = async () => {
            try {
                // Check for hash fragment in URL
                const hash = window.location.hash;

                if (!hash) {
                    setError('No authentication data found');
                    return;
                }

                // Extract tokens from hash (remove # character)
                const params = new URLSearchParams(hash.substring(1));
                const accessToken = params.get('access_token');

                if (!accessToken) {
                    setError('No access token found');
                    return;
                }

                // Get user type from search params or use default
                const userType = searchParams.get('user_type') || 'brand';

                // Set cookies
                setUserType(userType);
                setAuthToken(accessToken);

                // Make API call to backend
                const response = await fetch('/api/auth/facebook/process', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        access_token: accessToken,
                        user_type: userType
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Authentication failed');
                }

                // Redirect to dashboard or account selection page
                router.push('/auth/account-selection');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Authentication process failed');
            }
        };

        handleRedirect();
    }, [router, searchParams]);

    // Show loading state or error
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
                {error ? (
                    <>
                        <div className="flex justify-center">
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="mt-4 text-center text-xl font-semibold text-gray-900">Authentication Error</h2>
                        <p className="mt-2 text-center text-gray-600">{error}</p>
                        <div className="mt-6">
                            <button
                                onClick={() => router.push('/user-type-selection')}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Try Again
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-center">
                            <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-indigo-600"></div>
                        </div>
                        <h2 className="mt-4 text-center text-xl font-semibold text-gray-900">Processing Your Login</h2>
                        <p className="mt-2 text-center text-gray-600">Please wait while we authenticate your account...</p>
                    </>
                )}
            </div>
        </div>
    );
}