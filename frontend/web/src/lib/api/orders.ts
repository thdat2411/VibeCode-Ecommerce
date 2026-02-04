import axios, { AxiosError } from 'axios';
import { getUserId } from './auth';

const BFF_URL = process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:5000';

const apiClient = axios.create({
    baseURL: BFF_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export interface Order {
    id: string;
    userId: string;
    items: Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
    }>;
    total: number;
    status: string;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    createdAt: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
}

// Orders API
export async function getOrders(): Promise<Order[]> {
    try {
        const response = await apiClient.get<Order[]>('/api/orders', {
            headers: {
                'X-User-Id': getUserId()
            }
        });
        let data = response.data;
        
        // Handle case where response.data is a JSON string instead of object
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        
        return Array.isArray(data) ? data : [];
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to fetch orders');
        }
        throw error;
    }
}

// User API
export async function getUserInfo(): Promise<User> {
    try {
        const response = await apiClient.get<User>('/api/users/me', {
            headers: {
                'X-User-Id': getUserId()
            }
        });
        let data = response.data;
        
        // Handle case where response.data is a JSON string instead of object
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        
        return data as User;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to fetch user info');
        }
        throw error;
    }
}

export async function createOrder(orderData: any): Promise<Order> {
    try {
        const response = await apiClient.post<Order>('/api/orders', orderData, {
            headers: {
                'X-User-Id': getUserId()
            }
        });
        let data = response.data;
        
        // Handle case where response.data is a JSON string instead of object
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        
        return data as Order;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to create order');
        }
        throw error;
    }
}
