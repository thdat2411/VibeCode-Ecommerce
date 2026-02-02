const BFF_URL = process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:5000';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    variants: Record<string, string[]>;
    stock: number;
    createdAt: string;
}

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

// Helper to get userId from localStorage
export function getUserId(): string {
    if (typeof window === 'undefined') return 'temp-user-id';
    return localStorage.getItem('userId') || 'temp-user-id';
}

// Products API
export async function getProducts(): Promise<Product[]> {
    const res = await fetch(`${BFF_URL}/api/catalog/products`, {
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }

    return res.json();
}

export async function getProductById(id: string): Promise<Product> {
    const res = await fetch(`${BFF_URL}/api/catalog/products/${id}`, {
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('Failed to fetch product');
    }

    return res.json();
}

// Cart API
export async function getCart(): Promise<CartResponse> {
    const res = await fetch(`${BFF_URL}/api/cart`, {
        headers: {
            'X-User-Id': getUserId()
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('Failed to fetch cart');
    }

    return res.json();
}

export async function addToCart(item: Omit<CartItem, 'quantity'> & { quantity?: number }): Promise<void> {
    const res = await fetch(`${BFF_URL}/api/cart/items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-User-Id': getUserId()
        },
        body: JSON.stringify({
            ...item,
            quantity: item.quantity || 1
        })
    });

    if (!res.ok) {
        throw new Error('Failed to add item to cart');
    }
}

export async function removeFromCart(productId: string): Promise<void> {
    const res = await fetch(`${BFF_URL}/api/cart/items/${productId}`, {
        method: 'DELETE',
        headers: {
            'X-User-Id': getUserId()
        }
    });

    if (!res.ok) {
        throw new Error('Failed to remove item from cart');
    }
}

// Auth API
export async function login(email: string, password: string): Promise<{ token: string; userId: string }> {
    const res = await fetch(`${BFF_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
    }

    return res.json();
}

export async function register(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
}): Promise<{ token: string; userId: string }> {
    const res = await fetch(`${BFF_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Registration failed');
    }

    return res.json();
}

export async function googleSignIn(idToken: string): Promise<{ token: string; userId: string }> {
    const res = await fetch(`${BFF_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idToken })
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Google sign in failed');
    }

    return res.json();
}

// Auth helpers
export function setAuthToken(token: string, userId: string) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
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
    }
}

export function isAuthenticated(): boolean {
    return getAuthToken() !== null;
}