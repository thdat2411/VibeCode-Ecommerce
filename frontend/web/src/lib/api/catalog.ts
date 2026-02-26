import axios, { AxiosError } from 'axios';

const BFF_URL = process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:5000';

const apiClient = axios.create({
    baseURL: BFF_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export interface Collection {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    parentId: string | null;
    displayOrder: number;
    subCollections: Collection[];
}

export interface VariantOption {
    name: string;
    values: string[];
}

export interface VariantImage {
    variantType: string;
    variantValue: string;
    images: string[];
}

export interface ProductSku {
    id: string;
    skuCode: string;
    variantValues: Record<string, string>;
    stock: number;
    priceOverride: number | null;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    compareAtPrice: number | null;
    collectionId: string;
    collectionSlug: string;
    thumbnailImage: string;
    variantOptions: VariantOption[];
    variantImages: VariantImage[];
    skus: ProductSku[];
    totalStock: number;
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

// Collections API
export async function getCollections(): Promise<Collection[]> {
    try {
        const response = await apiClient.get<Collection[]>('/api/catalog/collections');
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to fetch collections');
        }
        throw error;
    }
}

export async function getCollectionBySlug(slug: string): Promise<Collection> {
    try {
        const response = await apiClient.get<Collection>(`/api/catalog/collections/${slug}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to fetch collection');
        }
        throw error;
    }
}

export async function getCollectionProducts(slug: string): Promise<{ collection: Collection; products: Product[]; count: number }> {
    try {
        const response = await apiClient.get<{ collection: Collection; products: Product[]; count: number }>(`/api/catalog/collections/${slug}/products`);
        console.log(`getCollectionProducts(${slug}) raw response:`, response.data);

        // Validate products array
        if (response.data.products) {
            const productsWithIssues = response.data.products
                .map((p, i) => p === null || p === undefined ? `[${i}] = ${p}` : null)
                .filter(Boolean);
            if (productsWithIssues.length > 0) {
                console.warn('Found null/undefined products:', productsWithIssues);
            }
        }

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to fetch collection products');
        }
        throw error;
    }
}
