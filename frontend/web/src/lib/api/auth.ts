import { AxiosError } from 'axios';
import { apiClient, handleApiError } from './client';

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    shippingAddress?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

export interface AuthResponse {
    token: string;
    userId: string;
}

// Auth API
export async function login(email: string, password: string): Promise<AuthResponse> {
    try {
        const response = await apiClient.post('/api/auth/login', { email, password });
        console.log('Login API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Login API error:', error);
        throw new Error(handleApiError(error));
    }
}

export async function register(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
}): Promise<AuthResponse> {
    try {
        const response = await apiClient.post('/api/auth/register', data);
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function googleSignIn(idToken: string): Promise<AuthResponse> {
    try {
        const response = await apiClient.post('/api/auth/google', { idToken });
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

// Auth helpers
export function setAuthToken(token: string, userId: string) {
    if (typeof window !== 'undefined') {
        // Store in localStorage for client-side access
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);

        // Also set HTTP-only cookies via API for server-side middleware
        // For now, we'll use regular cookies since we can't set HTTP-only from client
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
        document.cookie = `userId=${userId}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
    }
}

export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

export function clearAuth() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');

        // Clear cookies
        document.cookie = 'token=; path=/; max-age=0';
        document.cookie = 'userId=; path=/; max-age=0';
    }
}

export function isAuthenticated(): boolean {
    return getAuthToken() !== null;
}

export function getAuthStatus() {
    if (typeof window === 'undefined') {
        return { authenticated: false, token: null, userId: null };
    }
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return {
        authenticated: !!token,
        token: token?.substring(0, 20) + '...' || null,
        userId: userId || null
    };
}

// Helper to get userId from localStorage
export function getUserId(): string {
    if (typeof window === 'undefined') return '';
    const userId = localStorage.getItem('userId');
    if (!userId) {
        throw new Error('User not authenticated. Please log in again.');
    }
    return userId;
}
