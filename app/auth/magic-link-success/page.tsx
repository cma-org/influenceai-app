'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuthToken, setUserType } from '@/app/lib/utils/cookies';

export default function MagicLinkSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams?.get('token');
        const userType = searchParams?.get('user_type');

        if (token && userType) {
            // Store the JWT token and user type in cookies
            setAuthToken(token);
            setUserType(userType);

            // Redirect to dashboard after a short delay
            const timer = setTimeout(() => {
                router.push('/dashboard');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold mb-2">Successfully Authenticated!</h1>
                <p className="text-gray-600 mb-4">
                    You have been successfully authenticated. Redirecting to your dashboard...
                </p>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="text-blue-600 hover:underline"
                >
                    Go to Dashboard Now
                </button>
            </div>
        </div>
    );
}