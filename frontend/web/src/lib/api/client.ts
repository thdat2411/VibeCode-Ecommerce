import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { getAuthToken, clearAuth } from "./auth";

const BFF_URL = process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:5000";

/**
 * Create an enhanced API client with automatic interceptors
 * - Adds Authorization header to all requests
 * - Handles 401 errors by clearing auth and redirecting
 * - Implements exponential backoff for retries (5xx errors)
 * - Adds request ID for tracking
 */
export function createApiClient(): AxiosInstance {
    const client = axios.create({
        baseURL: BFF_URL,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Request interceptor - add auth token and metadata
    client.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            // Add authorization header
            const token = getAuthToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // Add request ID for tracking
            config.headers["X-Request-ID"] = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Add user ID if available
            if (typeof window !== "undefined") {
                const userId = localStorage.getItem("userId");
                if (userId) {
                    config.headers["X-User-Id"] = userId;
                }
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor - handle errors and retries
    client.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const config = error.config as InternalAxiosRequestConfig & { retryCount?: number };

            // Handle 401 - Unauthorized
            if (error.response?.status === 401) {
                clearAuth();

                // Redirect to login (client-side only)
                if (typeof window !== "undefined") {
                    window.location.href = "/auth?tab=login";
                }

                return Promise.reject(error);
            }

            // Handle 429 - Too Many Requests
            if (error.response?.status === 429) {
                const retryCount = config.retryCount || 0;

                if (retryCount < 3) {
                    // Exponential backoff: 1s, 2s, 4s
                    const delay = Math.pow(2, retryCount) * 1000;
                    config.retryCount = retryCount + 1;

                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(client(config));
                        }, delay);
                    });
                }
            }

            // Handle 5xx errors with retry logic
            if (error.response && error.response.status >= 500 && error.response.status < 600) {
                const retryCount = config.retryCount || 0;

                if (retryCount < 3) {
                    // Exponential backoff with jitter
                    const delay = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
                    config.retryCount = retryCount + 1;

                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(client(config));
                        }, delay);
                    });
                }
            }

            return Promise.reject(error);
        }
    );

    return client;
}

// Export a singleton instance
export const apiClient = createApiClient();

/**
 * Error handler utility for consistent error messages
 */
export function handleApiError(error: unknown): string {
    if (error instanceof AxiosError) {
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "An error occurred";

        return typeof message === "string" ? message : JSON.stringify(message);
    }

    return error instanceof Error ? error.message : "An unexpected error occurred";
}
