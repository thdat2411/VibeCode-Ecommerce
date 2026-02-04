import axios, { AxiosError } from 'axios';

const BFF_URL = process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:5000';

const apiClient = axios.create({
    baseURL: BFF_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Auth API
export async function login(email: string, password: string): Promise<{ token: string; userId: string }> {
    try {
        const response = await apiClient.post('/api/auth/login', { email, password });
        let data = response.data;
        
        // Handle case where response.data is a JSON string instead of object
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        
        // Backend returns { token, user: { id, ... } } or { token, userId }
        const userId = data.user?.id || data.userId || data.UserId || data.User?.Id || data.User?.id;

        return {
            token: data.token || data.Token,
            userId: userId
        };
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
        throw error;
    }
}

export async function register(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
}): Promise<{ token: string; userId: string }> {
    try {
        const response = await apiClient.post('/api/auth/register', data);
        let responseData = response.data;
        
        // Handle case where response.data is a JSON string instead of object
        if (typeof responseData === 'string') {
            responseData = JSON.parse(responseData);
        }

        // Backend returns { token, user: { id, ... } } or { token, userId }
        return {
            token: responseData.token || responseData.Token,
            userId: responseData.user?.id || responseData.userId || responseData.UserId || responseData.user?.Id || responseData.User?.Id
        };
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
        throw error;
    }
}

export async function googleSignIn(idToken: string): Promise<{ token: string; userId: string }> {
    try {
        const response = await apiClient.post('/api/auth/google', { idToken });
        let data = response.data;
        
        // Handle case where response.data is a JSON string instead of object
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        // Backend returns { token, user: { id, ... } } or { token, userId }
        return {
            token: data.token || data.Token,
            userId: data.user?.id || data.userId || data.UserId || data.User?.Id || data.User?.id
        };
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Google sign in failed');
        }
        throw error;
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
