"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/api/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (!authenticated) {
      router.push("/auth/signin");
    }
  }, [authenticated, router]);

  if (!authenticated) {
    return null;
  }

  return children;
}
