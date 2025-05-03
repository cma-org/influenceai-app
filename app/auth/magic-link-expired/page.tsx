'use client';
import { useRouter } from 'next/navigation';

export default function MagicLinkExpired() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold mb-2">Magic Link Expired</h1>
                <p className="text-gray-600 mb-6">
                    Your magic link has expired. Magic links are valid for 24 hours for security reasons.
                </p>
                <button
                    onClick={() => router.push('/auth')}
                    className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
                >
                    Request a New Link
                </button>
            </div>
        </div>
    );
}
