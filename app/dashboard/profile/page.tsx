// app/dashboard/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getUserType, getAuthToken } from '@/app/lib/utils/cookies';
import Link from 'next/link';

interface SocialAccount {
    id: string;
    platform: string;
    username: string;
    connected: boolean;
    profilePicture?: string;
}

interface UserProfile {
    id: string;
    username: string;
    email: string;
    userType: string;
    profilePicture?: string;
    socialAccounts: SocialAccount[];
}

export default function ProfileSettings() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userType = getUserType();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = getAuthToken();
                if (!token) {
                    throw new Error('Authentication token not found');
                }

                const response = await fetch('/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }

                const data = await response.json();
                setProfile(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const disconnectSocialAccount = async (accountId: string) => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(`/api/user/social-accounts/${accountId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to disconnect account');
            }

            // Update the local state to reflect the change
            if (profile) {
                setProfile({
                    ...profile,
                    socialAccounts: profile.socialAccounts.filter(account => account.id !== accountId),
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
                    <h1 className="text-xl font-bold text-red-500 mb-4">Error</h1>
                    <p className="text-gray-700">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
                    <h1 className="text-xl font-bold text-gray-800 mb-4">No Profile Data</h1>
                    <p className="text-gray-700">Unable to load profile data.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <div className="flex items-center mb-6">
                    <div className="mr-4">
                        {profile.profilePicture ? (
                            <img
                                src={profile.profilePicture}
                                alt={profile.username}
                                className="w-20 h-20 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-xl font-bold">
                                    {profile.username ? profile.username.charAt(0).toUpperCase() : 'U'}
                                </span>
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{profile.username}</h2>
                        <p className="text-gray-600">{profile.email}</p>
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded mt-1">
                            {userType === 'influencer' ? 'Influencer' : 'Brand'}
                        </span>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                disabled
                                value={profile.username}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                disabled
                                value={profile.email}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                            <input
                                type="text"
                                disabled
                                value={userType === 'influencer' ? 'Influencer' : 'Brand'}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Connected Social Accounts</h3>
                    <Link
                        href="/dashboard/connect-accounts"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                        Connect New Account
                    </Link>
                </div>

                {profile.socialAccounts.length === 0 ? (
                    <div className="bg-gray-50 p-4 rounded-md text-center">
                        <p className="text-gray-600">No social accounts connected yet.</p>
                        <p className="text-sm text-gray-500 mt-1">
                            Connect your social media accounts to manage them from this platform.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.socialAccounts.map((account) => (
                            <div
                                key={account.id}
                                className="border rounded-lg p-4 flex justify-between items-center"
                            >
                                <div className="flex items-center">
                                    {account.profilePicture ? (
                                        <img
                                            src={account.profilePicture}
                                            alt={account.username}
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-gray-500 font-bold">
                                                {account.platform.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-medium">{account.username}</h4>
                                        <p className="text-sm text-gray-500">{account.platform}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => disconnectSocialAccount(account.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Disconnect
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}