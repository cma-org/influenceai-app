// lib/utils/cookies.ts

// Constants
const TOKEN_NAME = 'auth_token';
const TOKEN_NAME_CLIENT = 'auth_token_client'; // Non-HTTP-only version for client access
const USER_TYPE_NAME = 'user_type';

/**
 * Client-side cookie utilities
 */

// Client-side: Set auth token in cookie
export const setAuthToken = (token: string) => {
    document.cookie = `${TOKEN_NAME_CLIENT}=${token}; path=/; max-age=2592000; SameSite=Lax`; // 30 days
};

// Client-side: Get auth token from cookie
export const getAuthToken = (): string | null => {
    // First try to get the non-HTTP-only token that we can access from JS
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith(`${TOKEN_NAME_CLIENT}=`));
    if (tokenCookie) {
        return tokenCookie.split('=')[1];
    }

    // As a fallback, try the regular token (though this won't work if it's HTTP-only)
    const httpOnlyTokenCookie = cookies.find(cookie => cookie.trim().startsWith(`${TOKEN_NAME}=`));
    return httpOnlyTokenCookie ? httpOnlyTokenCookie.split('=')[1] : null;
};

// Client-side: Remove auth token from cookie
export const removeAuthToken = () => {
    document.cookie = `${TOKEN_NAME}=; path=/; max-age=0`;
    document.cookie = `${TOKEN_NAME_CLIENT}=; path=/; max-age=0`;
};

// Client-side: Set user type in cookie
export const setUserType = (userType: string) => {
    document.cookie = `${USER_TYPE_NAME}=${userType}; path=/; max-age=2592000; SameSite=Lax`; // 30 days
};

// Client-side: Get user type from cookie
export const getUserType = (): string | null => {
    const cookies = document.cookie.split(';');
    const userTypeCookie = cookies.find(cookie => cookie.trim().startsWith(`${USER_TYPE_NAME}=`));
    return userTypeCookie ? userTypeCookie.split('=')[1] : null;
};

// Helper to parse cookies string (useful for SSR contexts)
export const parseCookies = (cookieString: string): Record<string, string> => {
    return cookieString.split(';').reduce((cookies, cookie) => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
            cookies[name] = value;
        }
        return cookies;
    }, {} as Record<string, string>);
};