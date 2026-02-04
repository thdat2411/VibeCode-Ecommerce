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

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface CartResponse {
    items: CartItem[];
    total: number;
}

// Cart API
export async function getCart(): Promise<CartResponse> {
    try {
        const response = await apiClient.get<CartResponse>('/api/cart', {
            headers: {
                'X-User-Id': getUserId()
            }
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to fetch cart');
        }
        throw error;
    }
}

export async function addToCart(item: Omit<CartItem, 'quantity'> & { quantity?: number }): Promise<void> {
    try {
        await apiClient.post('/api/cart/items', {
            ...item,
            quantity: item.quantity || 1
        }, {
            headers: {
                'X-User-Id': getUserId()
            }
        });
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to add item to cart');
        }
        throw error;
    }
}

export async function removeFromCart(productId: string): Promise<void> {
    try {
        await apiClient.delete(`/api/cart/items/${productId}`, {
            headers: {
                'X-User-Id': getUserId()
            }
        });
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to remove item from cart');
        }
        throw error;
    }
}
