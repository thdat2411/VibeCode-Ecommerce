"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { googleSignIn, setAuthToken } from "@/lib/api";

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleSignInButtonProps {
  onLoading?: (loading: boolean) => void;
  onError?: (error: string) => void;
}

export function GoogleSignInButton({
  onLoading,
  onError,
}: GoogleSignInButtonProps) {
  const router = useRouter();
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !window.google) return;

    // Initialize Google Sign-In button
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      callback: handleCredentialResponse,
    });

    // Render the button
    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      {
        theme: "outline",
        size: "large",
        width: "100%",
      },
    );
  }, [scriptLoaded]);

  async function handleCredentialResponse(response: any) {
    try {
      onLoading?.(true);

      const { token, userId } = await googleSignIn(response.credential);

      // Store auth data
      setAuthToken(token, userId);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Google sign in failed";
      onError?.(errorMessage);
      onLoading?.(false);
    }
  }

  if (!scriptLoaded) {
    return (
      <button
        disabled
        className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded text-gray-400 cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  return <div id="google-signin-button" className="flex justify-center" />;
}
