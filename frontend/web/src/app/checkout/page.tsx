"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { createOrder } from "@/lib/api/orders";
import { processCheckout } from "@/lib/api/payments";
import { useCart } from "@/lib/cart-context";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, loading, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "VN",
  });

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total,
        status: "pending",
        shippingAddress,
      };

      await createOrder(orderData);

      const checkoutData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress,
      };

      const paymentResponse = await processCheckout(checkoutData);

      if (paymentResponse.clientSecret) {
        clearCart();
        alert("Payment processing - redirecting to checkout");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to process checkout. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  function updateAddress(field: string, value: string) {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-sm tracking-widest uppercase text-gray-400">
          Đang tải...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
        <p className="text-sm tracking-widest uppercase text-gray-500">
          Giỏ hàng của bạn đang trống
        </p>
        <Link
          href="/catalog"
          className="border border-black text-black px-8 py-3 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 mb-8 text-xs tracking-widest uppercase text-black hover:underline"
      >
        <ArrowLeft size={14} />
        Quay lại giỏ hàng
      </Link>

      <h1 className="text-xl font-semibold tracking-widest uppercase mb-8">
        Thanh toán
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
        {/* ══ Left: shipping form ══ */}
        <form onSubmit={handleCheckout} className="space-y-6">
          <div className="border border-gray-200 p-6 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest">
              Địa chỉ giao hàng
            </h2>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5">
                Địa chỉ
              </label>
              <input
                type="text"
                required
                value={shippingAddress.street}
                onChange={(e) => updateAddress("street", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-black transition"
                placeholder="Số nhà, tên đường..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5">
                  Thành phố
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) => updateAddress("city", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-black transition"
                  placeholder="Hà Nội"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5">
                  Tỉnh / Thành
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.state}
                  onChange={(e) => updateAddress("state", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-black transition"
                  placeholder="HN"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5">
                  Mã bưu chính
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.postalCode}
                  onChange={(e) => updateAddress("postalCode", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-black transition"
                  placeholder="100000"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5">
                  Quốc gia
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.country}
                  onChange={(e) => updateAddress("country", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-black transition"
                  placeholder="VN"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-black text-white py-4 text-xs tracking-widest uppercase hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {processing ? "Đang xử lý..." : "Tiến hành thanh toán"}
          </button>
        </form>

        {/* ══ Right: order summary ══ */}
        <div className="sticky top-6 border border-gray-200 p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-widest">
            Đơn hàng
          </h2>

          {/* Items */}
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={`${item.productId}|${item.size ?? ""}|${item.color ?? ""}`}
                className="flex gap-3 text-sm"
              >
                <div className="relative w-14 h-16 shrink-0 bg-gray-100 overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                  {/* Qty badge */}
                  <span className="absolute -top-1.5 -right-1.5 bg-gray-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-wide font-medium line-clamp-2">
                    {item.name}
                  </p>
                  {item.color && (
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Màu: {item.color}
                    </p>
                  )}
                  {item.size && (
                    <p className="text-[11px] text-gray-500">Cỡ: {item.size}</p>
                  )}
                </div>
                <span className="text-xs shrink-0 self-start pt-0.5">
                  {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                </span>
              </li>
            ))}
          </ul>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Tạm tính</span>
              <span>{total.toLocaleString("vi-VN")}₫</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phí vận chuyển</span>
              <span className="text-gray-400 text-xs">
                Tính ở bước tiếp theo
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold">
              <span className="uppercase tracking-wide text-xs">Tổng cộng</span>
              <span>{total.toLocaleString("vi-VN")}₫</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
