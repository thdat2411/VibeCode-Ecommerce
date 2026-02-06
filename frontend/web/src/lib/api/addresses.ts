import { apiClient, handleApiError } from './client';
import { getUserId } from './auth';

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
        throw new Error(handleApiError(error));
    }
}

export async function addAddress(address: Omit<Address, 'id'>): Promise<Address> {
    try {
        const response = await apiClient.post<Address>('/api/addresses', address);
        let data = response.data;

        // Handle case where response.data is a JSON string instead of object
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        return data as Address;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function updateAddress(id: string, address: Partial<Address>): Promise<Address> {
    try {
        const response = await apiClient.put<Address>(`/api/addresses/${id}`, address);
        let data = response.data;

        // Handle case where response.data is a JSON string instead of object
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        return data as Address;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function deleteAddress(id: string): Promise<void> {
    try {
        await apiClient.delete(`/api/addresses/${id}`);
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function setDefaultAddress(id: string): Promise<void> {
    try {
        await apiClient.put(`/api/addresses/${id}/default`, {});
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}
