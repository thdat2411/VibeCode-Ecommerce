"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutResultPage() {
  const params = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm tracking-widest uppercase text-gray-400">
          Đang xử lý...
        </p>
      </div>
    );
  }

  const resultCode = params.get("resultCode");
  const message = params.get("message");
  const orderId = params.get("orderId");
  const transId = params.get("transId");
  const isSuccess = resultCode === "0";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-5 px-6 lg:px-16">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.25em] uppercase"
        >
          the new originals
        </Link>
      </header>

      <div className="max-w-[560px] mx-auto px-6 py-20 flex flex-col items-center text-center">
        {isSuccess ? (
          <>
            {/* Success icon */}
            <div className="w-16 h-16 rounded-full bg-[#fff0f6] flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-[#ae2070]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-xl font-semibold mb-2">
              Thanh toán thành công!
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
            </p>

            {/* Order details */}
            <div className="w-full border border-gray-200 rounded-lg px-6 py-5 text-left mb-8 space-y-3">
              {orderId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Mã đơn hàng</span>
                  <span className="font-medium font-mono">{orderId}</span>
                </div>
              )}
              {transId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Mã giao dịch MoMo</span>
                  <span className="font-medium font-mono">{transId}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phương thức</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#ae2070] text-white text-[8px] font-bold leading-none">
                    M
                  </span>
                  Ví MoMo
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Link
                href="/"
                className="flex-1 border border-black text-black py-3 text-xs tracking-widest uppercase text-center hover:bg-black hover:text-white transition rounded"
              >
                Về trang chủ
              </Link>
              <Link
                href="/catalog"
                className="flex-1 bg-black text-white py-3 text-xs tracking-widest uppercase text-center hover:bg-gray-800 transition rounded"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Failure icon */}
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h1 className="text-xl font-semibold mb-2">Thanh toán thất bại</h1>
            <p className="text-sm text-gray-500 mb-2">
              {message
                ? decodeURIComponent(message)
                : "Có lỗi xảy ra trong quá trình thanh toán."}
            </p>
            {resultCode && resultCode !== "0" && (
              <p className="text-xs text-gray-400 mb-6">Mã lỗi: {resultCode}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
              <Link
                href="/checkout"
                className="flex-1 bg-black text-white py-3 text-xs tracking-widest uppercase text-center hover:bg-gray-800 transition rounded"
              >
                Thử lại
              </Link>
              <Link
                href="/"
                className="flex-1 border border-black text-black py-3 text-xs tracking-widest uppercase text-center hover:bg-black hover:text-white transition rounded"
              >
                Về trang chủ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
