'use client';
import { useEffect, useState } from 'react';
import { getUserType, getAuthToken, removeAuthToken } from '@/app/lib/utils/cookies';
import { useRouter } from 'next/navigation';

interface UserData {
    id: number;
    email: string;
    user_type: string;
    username: string;
}

export default function Dashboard() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const userType = getUserType();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = getAuthToken();

                if (!token) {
                    router.push('/auth');
                    return;
                }

                // Fetch user data from backend
                const response = await fetch('/api/user/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const handleLogout = () => {
        removeAuthToken();
        router.push('/user-type-selection');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900">
                        {userType === 'influencer' ? 'Influencer Dashboard' : 'Brand Dashboard'}
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Welcome, {userData?.username}!</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Different content based on user type */}
                        {userType === 'influencer' ? (
                            <>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-blue-800 mb-2">Connect Your Accounts</h3>
                                    <p className="text-blue-600 text-sm">Link your social media profiles to get started</p>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-green-800 mb-2">Profile Analytics</h3>
                                    <p className="text-green-600 text-sm">View your engagement metrics and insights</p>
                                </div>

                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-purple-800 mb-2">Brand Opportunities</h3>
                                    <p className="text-purple-600 text-sm">Discover brands looking for influencers like you</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="bg-indigo-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-indigo-800 mb-2">Find Influencers</h3>
                                    <p className="text-indigo-600 text-sm">Discover and connect with relevant influencers</p>
                                </div>

                                <div className="bg-amber-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-amber-800 mb-2">Campaign Management</h3>
                                    <p className="text-amber-600 text-sm">Create and manage your influencer campaigns</p>
                                </div>

                                <div className="bg-teal-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-teal-800 mb-2">Performance Analytics</h3>
                                    <p className="text-teal-600 text-sm">Track engagement and ROI for your campaigns</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}