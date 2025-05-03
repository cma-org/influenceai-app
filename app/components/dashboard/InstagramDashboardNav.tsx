// components/DashboardNav.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUserType, removeAuthToken } from '@/app/lib/utils/cookies';
import { useRouter } from 'next/navigation';

const InstgramDashboardNav = () => {
    const [userType, setUserType] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const type = getUserType();
        setUserType(type);
    }, []);

    const handleLogout = () => {
        removeAuthToken();
        router.push('/user-type-selection');
    };

    const isActive = (path: string) => {
        return pathname === path ? 'bg-blue-800' : '';
    };

    return (
        <div className="bg-blue-900 text-white w-64 min-h-screen flex flex-col">
            <div className="p-4 border-b border-blue-800">
                <h1 className="text-xl font-bold">Instagram Dashboard</h1>
                <p className="text-sm text-blue-300 mt-1">
                    {userType === 'INFLUECER' ? 'Influencer Account' : 'Brand Account'}
                </p>
            </div>
            <nav className="flex-grow p-4">
                <ul className="space-y-2">
                    <li>
                        <Link
                            href="/dashboard"
                            className={`block p-2 rounded hover:bg-blue-800 ${isActive('/dashboard')}`}
                        >
                            Overview
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/instagram-posts"
                            className={`block p-2 rounded hover:bg-blue-800 ${isActive('/dashboard/instagram-posts')}`}
                        >
                            Instagram Posts
                        </Link>
                    </li>
                    {userType === 'influencer' && (
                        <li>
                            <Link
                                href="/dashboard/instagram-insights"
                                className={`block p-2 rounded hover:bg-blue-800 ${isActive('/dashboard/insights')}`}
                            >
                                Insights & Analytics
                            </Link>
                        </li>
                    )}
                    {userType === 'brand' && (
                        <li>
                            <Link
                                href="/dashboard/campaigns"
                                className={`block p-2 rounded hover:bg-blue-800 ${isActive('/dashboard/campaigns')}`}
                            >
                                Campaigns
                            </Link>
                        </li>
                    )}
                    <li>
                        <Link
                            href="/dashboard/profile"
                            className={`block p-2 rounded hover:bg-blue-800 ${isActive('/dashboard/profile')}`}
                        >
                            Profile Settings
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="p-4 border-t border-blue-800">
                <button
                    onClick={handleLogout}
                    className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded text-white transition duration-200"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default InstgramDashboardNav;