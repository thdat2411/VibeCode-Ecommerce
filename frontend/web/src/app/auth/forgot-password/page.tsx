"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: Implement forgot password API call
      // const response = await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div
        className="min-h-screen bg-white flex items-center justify-center"
        data-nav-theme="light"
      >
        <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 md:ml-[25%] md:mr-[10%]">
          <div className="max-w-md mx-auto">
            <div className="text-center">
              <h2 className="text-2xl mb-6">EMAIL ĐÃ GỪI</h2>
              <p className="text-sm text-gray-600 mb-8">
                Chúng tôi đã gửi một liên kết đặt lại mật khẩu đến{" "}
                <strong>{email}</strong>. Vui lòng kiểm tra email của bạn và làm
                theo hướng dẫn để đặt lại mật khẩu.
              </p>
              <p className="text-xs text-gray-500 mb-8">
                Nếu bạn không nhận được email, vui lòng kiểm tra thư mục Spam
                hoặc thử lại.
              </p>
              <Link
                href="/auth/signin"
                className="inline-flex items-center text-sm text-black hover:underline"
              >
                <ChevronLeft size={16} className="mr-2" />
                QUAY LẠI ĐĂNG NHẬP
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white flex items-center justify-center"
      data-nav-theme="light"
    >
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 md:ml-[25%] md:mr-[10%]">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl mb-2">ĐẶT LẠI MẬT KHẨU</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <p className="text-sm text-gray-600 mb-6">
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên
              kết để đặt lại mật khẩu.
            </p>

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border text-black border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder=""
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 text-sm tracking-wide hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "ĐANG GỪI..." : "GỪI LIÊN KỚT"}
            </button>

            <div className="text-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center text-sm text-black hover:underline"
              >
                <ChevronLeft size={16} className="mr-2" />
                QUAY LẠI ĐĂNG NHẬP
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
