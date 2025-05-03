// app/dashboard/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getUserType, removeAuthToken } from '@/app/lib/utils/cookies';
import Button from '@/app/components/common/Button';

export default function DashboardPage() {
    const router = useRouter();
    const [userType, setUserType] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is authenticated on client side
        const token = getAuthToken();
        const userTypeFromCookie = getUserType();

        if (!token) {
            router.push('/user-type-selection');
            return;
        }

        setUserType(userTypeFromCookie);
        setLoading(false);
    }, [router]);

    const handleLogout = () => {
        removeAuthToken();
        router.push('/user-type-selection');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="p-4 text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900">
                        {userType === 'influencer' ? 'Influencer Dashboard' : 'Brand Dashboard'}
                    </h1>
                    <Button onClick={handleLogout} variant="outline">
                        Sign Out
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Welcome to your dashboard
                    </h2>

                    {userType === 'influencer' ? (
                        <div className="space-y-4">
                            <p>
                                As an influencer, you'll be able to:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>View your Instagram profile metrics including follower count and engagement rate</li>
                                <li>Connect with brands for collaborations</li>
                                <li>Manage your content and campaigns</li>
                                <li>Track your performance and analytics</li>
                            </ul>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p>
                                As a brand, you'll be able to:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>View comprehensive Instagram profile metrics including follower growth and engagement</li>
                                <li>Discover and connect with relevant influencers</li>
                                <li>Create and manage campaigns</li>
                                <li>Track campaign performance and ROI</li>
                            </ul>
                        </div>
                    )}

                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-blue-700 text-sm">
                            This is a simple placeholder dashboard. In a production application, this would display data
                            fetched from the backend API based on the user's authentication token.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}