"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { isAuthenticated, clearAuth } from "@/lib/api";

interface AuthContextType {
  authenticated: boolean;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth status on mount
    setAuthenticated(isAuthenticated());
    setLoading(false);
  }, []);

  function logout() {
    clearAuth();
    setAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ authenticated, loading, logout }}>
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
