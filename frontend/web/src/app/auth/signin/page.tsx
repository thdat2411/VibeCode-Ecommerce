"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, setAuthToken } from "@/lib/api";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token, userId } = await login(email, password);

      // Store auth data
      setAuthToken(token, userId);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    // TODO: Implement Google OAuth flow
    alert("Google OAuth not yet implemented");
  }

  return (
    <div
      className="min-h-screen bg-white flex items-center justify-center"
      data-nav-theme="light"
    >
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 md:ml-[25%] md:mr-[10%]">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl  mb-2 text-black">ĐĂNG NHẬP</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {googleError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                {googleError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs  mb-3 uppercase tracking-wider text-black"
                >
                  EMAIL*
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border text-black border-gray-300  text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder=""
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs  mb-3 uppercase tracking-wider text-black"
                >
                  MẬT KHẨU*
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border text-black border-gray-300  text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder=""
                />
              </div>
            </div>

            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-xs text-gray-black hover:text-black hover:underline"
              >
                BẠN QUÊN MẬT KHẨU?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 text-sm tracking-wide hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "ĐANG NHẬP..." : "ĐĂNG NHẬP"}
            </button>

            <p className="text-center text-xs text-gray-600">
              BẠN CHƯA CÓ TÀI KHOẢN?{" "}
              <Link
                href="/auth/signup"
                className=" hover:text-black hover:underline"
              >
                TẠO TÀI KHOẢN
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
