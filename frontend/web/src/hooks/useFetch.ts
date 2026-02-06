import { useState, useCallback, useEffect } from "react";

interface UseFetchOptions {
    skip?: boolean;
    immediate?: boolean;
}

/**
 * Generic useFetch hook for data fetching
 * Manages loading, error, and data states automatically
 *
 * Usage:
 * // Simple data fetching
 * const { data, loading, error, refetch } = useFetch(
 *   () => fetchUserData(),
 *   { immediate: true }
 * );
 *
 * // Manual fetch
 * const { data, loading, error, fetch } = useFetch(
 *   () => fetchUserData(),
 *   { immediate: false }
 * );
 *
 * // Trigger fetch with button
 * <button onClick={() => fetch()}>Refresh</button>
 */
export function useFetch<T>(
    fetchFn: () => Promise<T>,
    options: UseFetchOptions = { immediate: true, skip: false }
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(!options.skip && options.immediate);
    const [error, setError] = useState<Error | null>(null);

    const fetch = useCallback(async () => {
        if (options.skip) return;

        try {
            setLoading(true);
            setError(null);
            const result = await fetchFn();
            setData(result);
        } catch (err) {
            const error = err instanceof Error ? err : new Error("An error occurred");
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [fetchFn, options.skip]);

    useEffect(() => {
        if (options.immediate) {
            fetch();
        }
    }, []);

    const refetch = useCallback(() => {
        fetch();
    }, [fetch]);

    return {
        data,
        loading,
        error,
        fetch,
        refetch,
    };
}
