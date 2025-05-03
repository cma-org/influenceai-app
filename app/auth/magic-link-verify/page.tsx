// app/auth/verify/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuthToken, setUserType } from '@/app/lib/utils/cookies';

export default function VerifyMagicLink() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [progress, setProgress] = useState(0);
    const searchParams = useSearchParams();
    const router = useRouter();
    const userType = searchParams.get('type') || 'Influencer';

    // Colors based on user type
    const themeColor = userType.toLowerCase() === 'influencer' ? 'orange' : 'indigo';
    const bgColor = `bg-${themeColor}-600`;
    const textColor = `text-${themeColor}-600`;
    const borderColor = `border-${themeColor}-300`;

    useEffect(() => {
        // Animate progress bar
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return prev;
                return prev + 10;
            });
        }, 300);

        const verifyToken = async () => {
            const token = searchParams.get('token');
            const email = searchParams.get('email');

            if (!token || !email) {
                setStatus('error');
                clearInterval(interval);
                return;
            }

            try {
                const response = await fetch('/api/auth/magic-link/verify-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, email }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setAuthToken(data.token);
                    setUserType(userType);
                    setProgress(100);
                    setStatus('success');
                    setTimeout(() => router.push('/dashboard'), 800);
                } else {
                    setStatus('error');
                }
            } catch (error) {
                setStatus('error');
            }
            clearInterval(interval);
        };

        verifyToken();
        return () => clearInterval(interval);
    }, [searchParams, router, userType]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                {status === 'loading' && (
                    <>
                        <div className="text-center mb-6">
                            <h2 className={`text-2xl font-semibold ${textColor}`}>Logging you in securely</h2>
                            <p className="text-gray-500 mt-2">Verifying your credentials...</p>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                            <div
                                className={`${bgColor} h-2.5 rounded-full transition-all duration-300 ease-out`}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        <div className="flex items-center justify-center">
                            <div
                                className={`animate-spin rounded-full h-8 w-8 border-b-2 ${borderColor}`}
                            ></div>
                        </div>
                    </>
                )}

                {status === 'success' && (
                    <div className="text-center">
                        <div className={`${bgColor} mx-auto rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800">Successfully verified!</h2>
                        <p className="text-gray-500 mt-2">Redirecting to your dashboard...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-center">
                        <div className="bg-red-100 mx-auto rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800">Verification Failed</h2>
                        <p className="text-gray-500 mt-2">This link is invalid or has expired.</p>
                        <button
                            onClick={() => router.push('/auth')}
                            className={`mt-6 ${bgColor} text-white px-6 py-2 rounded-md hover:opacity-90 transition`}
                        >
                            Request New Link
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}