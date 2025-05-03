'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

interface InstagramAccount {
    pageId: string;
    pageName: string;
    pageAccessToken: string;
    instagramAccountId: string;
}

export default function AccountSelection() {
    const [accounts, setAccounts] = useState<InstagramAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    // Extract authentication data from URL params
    const accessToken = searchParams.get('access_token');
    const userType = searchParams.get('user_type');

    useEffect(() => {
        if (!accessToken) {
            setError('Authentication token is missing. Please try logging in again.');
            setLoading(false);
            return;
        }

        // Fetch user's Facebook pages with Instagram business accounts
        async function fetchInstagramAccounts() {
            try {
                const response = await fetch('/api/auth/facebook/accounts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ access_token: accessToken }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch Instagram accounts');
                }

                const data = await response.json();

                if (!data.accounts || data.accounts.length === 0) {
                    setError('No Instagram business accounts found. Please make sure your Facebook page is connected to an Instagram business account.');
                    setLoading(false);
                    return;
                }

                setAccounts(data.accounts);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred');
                setLoading(false);
            }
        }

        fetchInstagramAccounts();
    }, [accessToken]);

    const handleAccountSelect = (accountId: string) => {
        setSelectedAccount(accountId);
    };

    const handleContinue = async () => {
        if (!selectedAccount) return;

        const selectedAccountData = accounts.find(account => account.instagramAccountId === selectedAccount);
        if (!selectedAccountData) return;

        try {
            setLoading(true);

            // Complete authentication with selected account
            const response = await fetch('/api/auth/facebook/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token: accessToken,
                    page_id: selectedAccountData.pageId,
                    page_name: selectedAccountData.pageName,
                    page_access_token: selectedAccountData.pageAccessToken,
                    instagram_business_account_id: selectedAccountData.instagramAccountId,
                    user_type: userType,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to complete authentication');
            }

            // Redirect to dashboard on success
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to complete authentication');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">Loading your Instagram accounts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
                    <div className="flex justify-center">
                        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="mt-4 text-center text-2xl font-semibold text-gray-900">Error</h2>
                    <p className="mt-2 text-center text-gray-600">{error}</p>
                    <div className="mt-6">
                        <button
                            onClick={() => router.push('/user-type-selection')}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const userTypeColor = userType === 'influencer' ? 'orange' : 'indigo';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Select Your Instagram Account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Choose the Instagram business account you want to connect with our platform
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="space-y-4">
                        {accounts.map((account) => (
                            <div
                                key={account.instagramAccountId}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAccount === account.instagramAccountId
                                    ? `border-${userTypeColor}-500 bg-${userTypeColor}-50`
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                onClick={() => handleAccountSelect(account.instagramAccountId)}
                            >
                            </div>
                        ))}

                        <div className="mt-6">
                            <button
                                onClick={handleContinue}
                                disabled={!selectedAccount || loading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${selectedAccount
                                    ? `bg-${userTypeColor}-600 hover:bg-${userTypeColor}-700`
                                    : 'bg-gray-300 cursor-not-allowed'
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${userTypeColor}-500`}
                            >
                                {loading ? (
                                    <>
                                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                                        Processing...
                                    </>
                                ) : (
                                    'Continue with Selected Account'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}