import React from 'react';
import Button from '../common/Button';
import { FACEBOOK_AUTH_CONFIG } from '@/app/config/facebook-auth';
import { setUserType } from '@/app/lib/utils/cookies';

interface FacebookLoginButtonProps {
    userType: 'influencer' | 'brand';
}

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({ userType }) => {
    const handleLogin = () => {
        // Store user type in cookie before redirecting
        setUserType(userType);

        // Get configuration
        const { baseUrl, scopes, extras } = FACEBOOK_AUTH_CONFIG;
        const clientId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '';
        const redirectUri = process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI || '';

        // Build the Facebook login URL
        const loginUrl = `${baseUrl}?client_id=${clientId}&display=page&extras=${encodeURIComponent(JSON.stringify(extras))}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scopes.join(',')}`;

        // Redirect to Facebook login
        window.location.href = loginUrl;
    };

    // Style based on user type
    const buttonColorClass = userType === 'influencer' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-indigo-600 hover:bg-indigo-700';

    return (
        <Button
            onClick={handleLogin}
            className={`flex items-center justify-center px-5 py-3 ${buttonColorClass} text-white font-medium rounded-md w-full`}
        >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
            Connect with Facebook
        </Button>
    );
};

export default FacebookLoginButton;