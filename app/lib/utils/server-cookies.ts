// lib/utils/server-cookies.ts

import { cookies } from 'next/headers';

// Constants
const TOKEN_NAME = 'auth_token';
const USER_TYPE_NAME = 'user_type';

/**
 * Server-side cookie utilities
 * IMPORTANT: These functions can ONLY be used in Server Components
 */

// Get a cookie value by name
export const getServerCookie = async (name: string) => {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
};

// Get auth token from server cookies
export const getServerAuthToken = () => {
    return getServerCookie(TOKEN_NAME);
};

// Get user type from server cookies
export const getServerUserType = () => {
    return getServerCookie(USER_TYPE_NAME);
};

// Set a cookie on the server
export const setServerCookie = async (name: string, value: string, options: any = {}) => {
    const cookieStore = await cookies();
    cookieStore.set(name, value, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        ...options,
    });
};

// Set auth token in server cookies
export const setServerAuthToken = (token: string) => {
    setServerCookie(TOKEN_NAME, token);
};

// Set user type in server cookies
export const setServerUserType = (userType: string) => {
    setServerCookie(USER_TYPE_NAME, userType);
};