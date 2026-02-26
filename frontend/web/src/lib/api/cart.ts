import { AxiosError } from 'axios';
import { apiClient, handleApiError } from './client';
import { getUserId } from './auth';

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size?: string;
    color?: string;
}

/** Stable unique key for a cart line — same product with different size/color = different line */
export function cartKey(item: Pick<CartItem, 'productId' | 'size' | 'color'>): string {
    return `${item.productId}|${item.size ?? ''}|${item.color ?? ''}`;
}

export interface CartResponse {
    items: CartItem[];
    total: number;
}

// Cart API
export async function getCart(): Promise<CartResponse> {
    try {
        const response = await apiClient.get<CartResponse>('/api/cart');
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function addToCart(item: Omit<CartItem, 'quantity'> & { quantity?: number }): Promise<void> {
    try {
        await apiClient.post('/api/cart/items', {
            ...item,
            quantity: item.quantity || 1
        });
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function removeFromCart(item: Pick<CartItem, 'productId' | 'size' | 'color'>): Promise<void> {
    try {
        await apiClient.delete(`/api/cart/items/${item.productId}`, {
            data: { size: item.size, color: item.color },
        });
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}
