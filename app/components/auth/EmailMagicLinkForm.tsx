// components/auth/EmailMagicLinkForm.tsx

import React, { useState } from 'react';
import Button from '../common/Button';
import { sendMagicLink } from '../../lib/auth/authService';
import { UserType } from '../../lib/types';

interface EmailMagicLinkFormProps {
    userType: UserType;
}

const EmailMagicLinkForm: React.FC<EmailMagicLinkFormProps> = ({ userType }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Validate email first
            if (!email || !email.includes('@')) {
                setError('Please enter a valid email address.');
                setIsLoading(false);
                return;
            }
            console.log("component: ", email, userType)

            // Add domain validation for brand users
            if (userType === 'brand') {
                // This is a simple business email check. In a real app, you might have a more comprehensive check
                const isBusinessEmail = !email.endsWith('@gmail.com') &&
                    !email.endsWith('@yahoo.com') &&
                    !email.endsWith('@hotmail.com') &&
                    !email.endsWith('@outlook.com');

                if (!isBusinessEmail) {
                    setError('Please use a business email address.');
                    setIsLoading(false);
                    return;
                }
            }

            await sendMagicLink(email, userType);
            setIsSent(true);
        } catch (error: any) {
            setError(error.message || 'Failed to send magic link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-green-800 font-medium mb-2">Magic Link Sent!</h3>
                <p className="text-green-700 mb-3">
                    Check your email ({email}) for a link to sign in. The link will expire in 24 hours.
                </p>
                <p className="text-sm text-green-600">
                    Can't find the email? Check your spam folder or try again in a few minutes.
                </p>
                <button
                    onClick={() => setIsSent(false)}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-800"
                >
                    Try a different email
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={userType === 'brand' ? 'company@example.com' : 'you@example.com'}
                />
                {userType === 'brand' && (
                    <p className="mt-1 text-sm text-gray-500">
                        Please use your business email address.
                    </p>
                )}
            </div>

            {error && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? 'Sending...' : 'Send Magic Link'}
            </Button>
        </form>
    );
};

export default EmailMagicLinkForm;