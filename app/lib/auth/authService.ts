// lib/auth/authService.ts

import { AuthResponse, UserType } from '../types';
import { setAuthToken, setUserType } from '../utils/cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const getInstagramAuthUrl = async (): Promise<string> => {
    try {
        const response = await fetch('/api/auth/instagram/authorize');
        const data = await response.json();
        return data.authorizationUrl;
    } catch (error) {
        console.error('Failed to get Instagram authorization URL:', error);
        throw error;
    }
};

export const getFacebookAuthUrl = async (): Promise<string> => {
    try {
        const response = await fetch('/api/auth/facebook/authorize');
        const data = await response.json();
        return data.authorizationUrl;
    } catch (error) {
        console.error('Failed to get Facebook authorization URL:', error);
        throw error;
    }
};

export const handleInstagramCallback = async (code: string, userType: UserType): Promise<AuthResponse> => {
    try {
        const response = await fetch('/api/auth/instagram/callback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, userType }),
        });

        if (!response.ok) {
            throw new Error('Authentication failed');
        }

        const data: AuthResponse = await response.json();

        // Store token and user type in cookies
        setAuthToken(data.token);
        setUserType(data.user.userType);

        return data;
    } catch (error) {
        console.error('Failed to handle Instagram callback:', error);
        throw error;
    }
};

export const sendMagicLink = async (email: string, userType: UserType): Promise<boolean> => {
    try {
        // Call our Next.js API route
        const response = await fetch('/api/auth/magic-link/authorize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, userType }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to send magic link');
        }

        return true;
    } catch (error) {
        console.error('Failed to send magic link:', error);
        throw error;
    }
};

export const verifyUserAuthentication = async (): Promise<boolean> => {
    // This will be used in middleware to check if user is authenticated
    // For now, just check if token exists in cookies
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

    return !!token;
};