"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  isAuthenticated,
  clearAuth,
  getAuthToken,
  getUserId,
} from "@/lib/api/auth";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  shippingAddress?: string;
}

interface AuthContextType {
  authenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth status on mount
    if (isAuthenticated()) {
      const storedToken = getAuthToken();
      const storedUserId =
        typeof window !== "undefined" ? localStorage.getItem("userId") : null;

      setAuthenticated(true);
      setToken(storedToken);

      if (storedUserId) {
        setUserState({
          id: storedUserId,
          email: "",
          name: "",
        });
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((newUser: User, authToken: string) => {
    setAuthenticated(true);
    setUser(newUser);
    setToken(authToken);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAuthenticated(false);
    setUser(null);
    setToken(null);
  }, []);

  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{ authenticated, user, token, loading, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
