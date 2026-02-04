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

export interface CheckoutPayload {
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
}

export interface PaymentResponse {
    clientSecret: string;
    orderId: string;
}

// Payments API
export async function processCheckout(checkoutData: CheckoutPayload): Promise<PaymentResponse> {
    try {
        const response = await apiClient.post<PaymentResponse>('/api/payments/checkout', checkoutData, {
            headers: {
                'X-User-Id': getUserId()
            }
        });
        let data = response.data;
        
        // Handle case where response.data is a JSON string instead of object
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        
        return data as PaymentResponse;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Checkout failed');
        }
        throw error;
    }
}
