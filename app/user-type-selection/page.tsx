// app/user-type-selection/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/common/Button';
import { setUserType } from '@/app/lib/utils/cookies';
import { UserType } from '@/app/lib/types';

export default function UserTypeSelectionPage() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<UserType | null>(null);

    const handleSelectType = (type: UserType) => {
        setSelectedType(type);
    };

    const handleContinue = () => {
        if (selectedType) {
            setUserType(selectedType);
            router.push('/auth');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome!</h1>
                    <p className="mt-2 text-gray-600">
                        Please select your account type to continue
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    <button
                        className={`w-full p-4 border rounded-lg transition-colors flex flex-col items-center ${selectedType === 'influencer'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:bg-gray-50'
                            }`}
                        onClick={() => handleSelectType('influencer')}
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="font-medium text-gray-900">Influencer</h3>
                        <p className="mt-1 text-sm text-black">
                            Create content and engage with brands
                        </p>
                    </button>

                    <button
                        className={`w-full p-4 border rounded-lg transition-colors flex flex-col items-center ${selectedType === 'brand'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:bg-gray-50'
                            }`}
                        onClick={() => handleSelectType('brand')}
                    >
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-medium text-gray-900">Brand</h3>
                        <p className="mt-1 text-sm text-black">
                            Discover influencers and manage campaigns
                        </p>
                    </button>
                </div>

                <div className="mt-6">
                    <Button
                        onClick={handleContinue}
                        className="w-full"
                        disabled={!selectedType}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}