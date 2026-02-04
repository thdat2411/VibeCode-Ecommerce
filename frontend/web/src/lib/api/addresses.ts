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

export interface Address {
    id: string;
    firstName: string;
    lastName: string;
    company?: string;
    street: string;
    ward?: string;
    district: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
    isDefault?: boolean;
}

// Address API
export async function getAddresses(): Promise<Address[]> {
    try {
        const response = await apiClient.get<Address[]>('/api/addresses', {
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
            throw new Error(error.response?.data?.message || 'Failed to fetch addresses');
        }
        throw error;
    }
}

export async function addAddress(address: Omit<Address, 'id'>): Promise<Address> {
    try {
        const response = await apiClient.post<Address>('/api/addresses', address, {
            headers: {
                'X-User-Id': getUserId()
            }
        });
        let data = response.data;
        
        // Handle case where response.data is a JSON string instead of object
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        
        return data as Address;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to add address');
        }
        throw error;
    }
}

export async function updateAddress(id: string, address: Partial<Address>): Promise<Address> {
    try {
        const response = await apiClient.put<Address>(`/api/addresses/${id}`, address, {
            headers: {
                'X-User-Id': getUserId()
            }
        });
        let data = response.data;
        
        // Handle case where response.data is a JSON string instead of object
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        
        return data as Address;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to update address');
        }
        throw error;
    }
}

export async function deleteAddress(id: string): Promise<void> {
    try {
        await apiClient.delete(`/api/addresses/${id}`, {
            headers: {
                'X-User-Id': getUserId()
            }
        });
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to delete address');
        }
        throw error;
    }
}

export async function setDefaultAddress(id: string): Promise<void> {
    try {
        await apiClient.put(`/api/addresses/${id}/default`, {}, {
            headers: {
                'X-User-Id': getUserId()
            }
        });
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to set default address');
        }
        throw error;
    }
}
