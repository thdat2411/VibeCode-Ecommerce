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

// Products API
export async function getProducts(): Promise<Product[]> {
    try {
        const response = await apiClient.get<Product[]>('/api/catalog/products');
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to fetch products');
        }
        throw error;
    }
}

export async function getProductById(id: string): Promise<Product> {
    try {
        const response = await apiClient.get<Product>(`/api/catalog/products/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to fetch product');
        }
        throw error;
    }
}
