import { apiClient, handleApiError } from './client';

export interface CartItem {
    productId: string;
    skuId?: string;
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

export interface CreateGuestCartResponse {
    cartId: string;
    cart: CartResponse;
}

// ── Guest cart ID cookie helpers ─────────────────────────────────────────────

const CART_ID_COOKIE = 'cart_id';

export function getGuestCartId(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${CART_ID_COOKIE}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

export function setGuestCartId(cartId: string) {
    if (typeof document === 'undefined') return;
    const maxAge = 7 * 24 * 60 * 60; // 7 days
    document.cookie = `${CART_ID_COOKIE}=${encodeURIComponent(cartId)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearGuestCartId() {
    if (typeof document === 'undefined') return;
    document.cookie = `${CART_ID_COOKIE}=; path=/; max-age=0`;
}

// ── Authenticated user cart ──────────────────────────────────────────────────

export async function getCart(): Promise<CartResponse> {
    try {
        const response = await apiClient.get<CartResponse>('/api/cart');
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function addToCart(item: Omit<CartItem, 'quantity'> & { quantity?: number }): Promise<CartResponse> {
    try {
        const response = await apiClient.post<CartResponse>('/api/cart/items', {
            ...item,
            quantity: item.quantity ?? 1,
        });
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function removeFromCart(item: Pick<CartItem, 'productId' | 'size' | 'color'>): Promise<CartResponse> {
    try {
        const response = await apiClient.delete<CartResponse>(`/api/cart/items/${item.productId}`, {
            data: { size: item.size, color: item.color },
        });
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function updateCartItemQuantity(
    item: Pick<CartItem, 'productId' | 'size' | 'color'>,
    quantity: number,
): Promise<CartResponse> {
    try {
        const response = await apiClient.patch<CartResponse>(`/api/cart/items/${item.productId}`, {
            quantity,
            size: item.size,
            color: item.color,
        });
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function clearCart(): Promise<void> {
    try {
        await apiClient.delete('/api/cart');
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

// ── Guest cart ───────────────────────────────────────────────────────────────

export async function createGuestCart(
    item: Omit<CartItem, 'quantity'> & { quantity?: number },
): Promise<CreateGuestCartResponse> {
    try {
        const response = await apiClient.post<CreateGuestCartResponse>('/api/cart/guest', {
            ...item,
            quantity: item.quantity ?? 1,
        });
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function getGuestCart(cartId: string): Promise<CartResponse> {
    try {
        const response = await apiClient.get<CartResponse>(`/api/cart/guest/${cartId}`);
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function addToGuestCart(
    cartId: string,
    item: Omit<CartItem, 'quantity'> & { quantity?: number },
): Promise<CartResponse> {
    try {
        const response = await apiClient.post<CartResponse>(`/api/cart/guest/${cartId}/items`, {
            ...item,
            quantity: item.quantity ?? 1,
        });
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function removeFromGuestCart(
    cartId: string,
    item: Pick<CartItem, 'productId' | 'size' | 'color'>,
): Promise<CartResponse> {
    try {
        const response = await apiClient.delete<CartResponse>(
            `/api/cart/guest/${cartId}/items/${item.productId}`,
            { data: { size: item.size, color: item.color } },
        );
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function clearGuestCart(cartId: string): Promise<void> {
    try {
        await apiClient.delete(`/api/cart/guest/${cartId}`);
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

// ── Merge (call on login) ────────────────────────────────────────────────────

export async function mergeCart(cartId: string): Promise<CartResponse> {
    try {
        const response = await apiClient.post<CartResponse>('/api/cart/merge', { cartId });
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}
