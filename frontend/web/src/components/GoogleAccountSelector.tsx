"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { googleSignIn, setAuthToken } from "@/lib/api/auth";
import { X } from "lucide-react";

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleAccount {
  email: string;
  name: string;
  picture: string;
}

interface GoogleAccountSelectorProps {
  onLoading?: (loading: boolean) => void;
  onError?: (error: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function GoogleAccountSelector({
  onLoading,
  onError,
  isOpen,
  onClose,
}: GoogleAccountSelectorProps) {
  const router = useRouter();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [accounts, setAccounts] = useState<GoogleAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<GoogleAccount | null>(
    null,
  );

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
    if (!scriptLoaded || !window.google || !isOpen) return;

    // Initialize One Tap UI to get available accounts
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      callback: handleCredentialResponse,
    });

    // Render One Tap to fetch available accounts
    try {
      window.google.accounts.id.renderButton(document.createElement("div"), {
        theme: "outline",
        size: "large",
      });
    } catch (e) {
      // Silent fail - just used to initialize
    }
  }, [scriptLoaded, isOpen]);

  async function handleCredentialResponse(response: any) {
    try {
      onLoading?.(true);

      console.log("Google Sign-In attempting with credential...");
      const { token, userId } = await googleSignIn(response.credential);

      console.log("Google Sign-In response received:", {
        token: token?.substring(0, 20) + "...",
        userId,
        isTokenDefined: token !== undefined,
        isUserIdDefined: userId !== undefined,
      });

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

  async function handleAccountSelect(account: GoogleAccount) {
    setSelectedAccount(account);
    try {
      onLoading?.(true);

      // Trigger Google Sign-In with selected account
      if (!window.google) {
        throw new Error("Google SDK not loaded");
      }

      // Use the One Tap prompt which shows account selector
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          // If One Tap is not displayed, fallback to button click
          window.google.accounts.id.renderButton(
            document.createElement("div"),
            { theme: "outline", size: "large" },
          );
        }
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign in";
      onError?.(errorMessage);
      onLoading?.(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-black">
            Chọn tài khoản Google
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {/* Option: Sign in with new account */}
          <button
            onClick={() => {
              if (window.google) {
                window.google.accounts.id.prompt();
              }
            }}
            className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded hover:bg-gray-50 transition text-left"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-lg">
              +
            </div>
            <div>
              <p className="font-medium text-black text-sm">
                Sử dụng tài khoản khác
              </p>
              <p className="text-xs text-gray-500">
                Đăng nhập hoặc tạo tài khoản Google mới
              </p>
            </div>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-500">hoặc</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Sign in form button as alternative */}
          <button
            onClick={onClose}
            className="w-full py-2 text-sm text-gray-600 hover:text-black transition"
          >
            Quay lại đăng ký
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 text-xs text-gray-500 text-center border-t border-gray-200">
          Bằng cách đăng nhập, bạn đồng ý với Điều khoản của chúng tôi
        </div>
      </div>
    </div>
  );
}
