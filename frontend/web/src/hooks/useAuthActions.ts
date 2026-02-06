import { useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { useNotification } from "@/lib/notification-context";
import { login as apiLogin, register as apiRegister, googleSignIn as apiGoogleSignIn, setAuthToken } from "@/lib/api/auth";

/**
 * useAuth hook for authentication operations
 * Handles login, register, and Google sign-in
 *
 * Usage:
 * const { login, register, googleSignIn, logout, user } = useAuth();
 *
 * // Login
 * await login({ email, password });
 *
 * // Register
 * await register({ email, password, name });
 *
 * // Google Sign In
 * await googleSignIn(idToken);
 */
export function useAuthActions() {
    const { login: setAuthUser, logout: clearAuthUser, setUser } = useAuth();
    const { addToast } = useNotification();

    const login = useCallback(
        async (credentials: { email: string; password: string }) => {
            try {
                const { token, userId } = await apiLogin(credentials.email, credentials.password);
                setAuthToken(token, userId);
                setUser({ id: userId, email: credentials.email, name: "" } as any);

                addToast("Login successful!", "success");
                return true;
            } catch (error) {
                const errorMsg = error instanceof Error ? error.message : "Login failed";
                addToast(errorMsg, "error");
                throw error;
            }
        },
        [setAuthUser, setUser, addToast]
    );

    const register = useCallback(
        async (data: { email: string; password: string; name: string; phone?: string }) => {
            try {
                const { token, userId } = await apiRegister(data);
                setAuthToken(token, userId);
                setUser({ id: userId, email: data.email, name: data.name } as any);

                addToast("Registration successful!", "success");
                return true;
            } catch (error) {
                const errorMsg = error instanceof Error ? error.message : "Registration failed";
                addToast(errorMsg, "error");
                throw error;
            }
        },
        [setAuthUser, setUser, addToast]
    );

    const googleSignIn = useCallback(
        async (idToken: string) => {
            try {
                const { token, userId } = await apiGoogleSignIn(idToken);
                setAuthToken(token, userId);
                setUser({ id: userId, email: "", name: "" } as any);

                addToast("Google sign-in successful!", "success");
                return true;
            } catch (error) {
                const errorMsg = error instanceof Error ? error.message : "Google sign-in failed";
                addToast(errorMsg, "error");
                throw error;
            }
        },
        [setAuthUser, setUser, addToast]
    );

    const logout = useCallback(() => {
        clearAuthUser();
        addToast("Logged out successfully", "info");
    }, [clearAuthUser, addToast]);

    return {
        login,
        register,
        googleSignIn,
        logout,
    };
}
