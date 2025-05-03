// lib/types/index.ts

export type UserType = 'influencer' | 'brand';

export interface User {
    id: string;
    name: string;
    email: string;
    userType: UserType;
    profilePicture?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}