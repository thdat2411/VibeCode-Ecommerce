"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register, setAuthToken } from "@/lib/api";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [googleError, setGoogleError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token, userId } = await register(formData);

      // Store auth data
      setAuthToken(token, userId);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div
      className="min-h-screen bg-white flex items-center justify-center"
      data-nav-theme="light"
    >
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 md:ml-[25%] md:mr-[10%]">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl mb-2 text-black">TẠO TÀI KHOẢN</h2>
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
                  htmlFor="name"
                  className="block text-xs mb-3 uppercase tracking-wider text-black"
                >
                  HỌ VÀ TÊN*
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full px-4 py-3 border text-black border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder=""
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs mb-3 uppercase tracking-wider text-black"
                >
                  EMAIL*
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full px-4 py-3 border text-black border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder=""
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs mb-3 uppercase tracking-wider text-black"
                >
                  SỐ ĐIỆN THOẠI
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full px-4 py-3 border text-black border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder=""
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs mb-3 uppercase tracking-wider text-black"
                >
                  MẬT KHẨU*
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className="w-full px-4 py-3 border text-black border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder=""
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 text-sm tracking-wide hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "ĐANG TẠO TÀI KHOẢN..." : "TẠO TÀI KHOẢN"}
            </button>

            <p className="text-center text-xs text-gray-600">
              ĐÃ CÓ TÀI KHOẢN?{" "}
              <Link
                href="/auth/signin"
                className="hover:text-black hover:underline"
              >
                ĐĂNG NHẬP
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
