// app/auth/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import InstagramLoginButton from '@/app/components/auth/InstagramLoginButton';
import FacebookLoginButton from '@/app/components/auth/FacebookLoginButton';
import GoogleLoginButton from '@/app/components/auth/GoogleLoginButton';
import EmailMagicLinkForm from '@/app/components/auth/EmailMagicLinkForm';
import { getUserType } from '@/app/lib/utils/cookies';
import { UserType } from '@/app/lib/types';

export default function AuthPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [userType, setUserType] = useState<UserType | null>(null);
    const [authMethod, setAuthMethod] = useState<string | null>(null);
    const error = searchParams?.get('error');

    useEffect(() => {
        // Get user type from cookies
        const storedUserType = getUserType() as UserType | null;

        if (!storedUserType) {
            // If no user type found, redirect to user type selection
            router.push('/user-type-selection');
        } else {
            setUserType(storedUserType);
        }
    }, [router]);

    if (!userType) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="p-4 text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {userType === 'influencer' ? 'Influencer Login' : 'Brand Login'}
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Choose your preferred login method
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-700">
                            {error === 'missing_code'
                                ? 'Authentication failed: Missing authorization code.'
                                : error === 'server_error'
                                    ? 'Authentication failed: Server error.'
                                    : `Authentication failed: ${error}`}
                        </p>
                    </div>
                )}

                <div className="mt-8">
                    {authMethod === 'email' ? (
                        <div>
                            <button
                                onClick={() => setAuthMethod(null)}
                                className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back
                            </button>

                            <h3 className="font-medium mb-4 text-gray-900">Sign in with Email</h3>
                            <EmailMagicLinkForm userType={userType} />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Instagram Login Button */}
                            <div>
                                <InstagramLoginButton userType={userType} />
                            </div>

                            {/* Facebook Login Button */}
                            <div>
                                <FacebookLoginButton userType={userType} />
                            </div>

                            {/* Google Login Button */}
                            <div>
                                <GoogleLoginButton userType={userType} />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-black">or continue with</span>
                                </div>
                            </div>

                            {/* Email Magic Link Button */}
                            <button
                                onClick={() => setAuthMethod('email')}
                                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email Magic Link
                            </button>
                        </div>
                    )}
                </div>

                {/* Info box for business users */}
                {userType === 'brand' && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <h3 className="text-sm font-medium text-blue-800 mb-1">Business Account Note</h3>
                        <p className="text-sm text-blue-700">
                            For Instagram and Facebook login, please ensure you have a Business or Creator account linked to a Facebook Page to access analytics and content management features.
                        </p>
                        <ul className="mt-2 text-xs text-blue-700 pl-5 list-disc space-y-1">
                            <li>Instagram Business/Creator account required</li>
                            <li>Account must be linked to a Facebook Page</li>
                            <li>You'll need admin permissions on the Facebook Page</li>
                        </ul>
                    </div>
                )}

                {/* Info box for influencers */}
                {userType === 'influencer' && (
                    <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-md">
                        <h3 className="text-sm font-medium text-purple-800 mb-1">Influencer Account Note</h3>
                        <p className="text-sm text-purple-700">
                            To access all features, we recommend connecting with Instagram. This allows you to view your metrics and engage with brands more effectively.
                        </p>
                    </div>
                )}

                {/* Option to change user type */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.push('/user-type-selection')}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        Change user type
                    </button>
                </div>
            </div>
        </div>
    );
}