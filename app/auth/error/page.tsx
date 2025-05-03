'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Extract error message from URL parameters
    const message = searchParams.get('message') || 'Authentication failed';

    // Get all URL parameters and filter out known ones
    const allParams = Array.from(searchParams.entries());
    const extraParams = allParams.filter(([key]) => key !== 'message' && key !== 'userType');
    // Get user type color - default to brand (indigo) if not specified
    const userType = searchParams.get('userType') || 'brand';
    const themeColor = userType === 'influencer' ? 'orange' : 'indigo';
    const buttonBgColor = userType === 'influencer' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-indigo-600 hover:bg-indigo-700';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Authentication Error
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {message}
                </p>
                {extraParams.length > 0 && (
                    <div className="mt-2 text-center text-xs text-gray-500">
                        {extraParams.map(([key, value]) => (
                            <p key={key} className="mt-1">
                                <span className="font-medium">{key}:</span> {value}
                            </p>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="mt-2 mb-6">
                        <p className="text-center text-gray-700">
                            There was a problem with your authentication process. This could be due to:
                        </p>
                        <ul className="mt-3 list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>Your Facebook session expired</li>
                            <li>Required permissions were not granted</li>
                            <li>Your Instagram account is not set up as a business account</li>
                            <li>Your Instagram account is not connected to a Facebook page</li>
                            <li>Network or server connectivity issues</li>
                        </ul>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <button
                            onClick={() => router.push('/user-type-selection')}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${buttonBgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${themeColor}-500`}
                        >
                            Try Again
                        </button>

                        <Link href="/" className="w-full">
                            <button
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Return to Home
                            </button>
                        </Link>
                    </div>

                    <div className="mt-6">
                        <p className="text-xs text-center text-gray-500">
                            Need help? Please contact our support team at <a href="mailto:support@example.com" className={`text-${themeColor}-600`}>support@example.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}