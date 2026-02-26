"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { cartKey } from "@/lib/api/cart";

export default function CartPage() {
  const { items, total, removeItem, updateQuantity } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");

  function triggerRemove(key: string, item: Parameters<typeof removeItem>[0]) {
    if (removingId) return;
    setRemovingId(key);
    setTimeout(() => {
      removeItem(item);
      setRemovingId(null);
    }, 320);
  }

  const isEmpty = items.length === 0;

  return (
    <main
      className="max-w-7xl pt-[10%] px-4 sm:px-6 lg:px-8 lg:ml-[25%] lg:mr-[10%] bg-white text-black"
      data-nav-theme="light"
    >
      {/* ── Page title ── */}
      <h1 className="text-xl font-semibold tracking-widest uppercase mb-8">
        Giỏ hàng ({items.length})
      </h1>

      {isEmpty ? (
        /* ── Empty state ── */
        <div className="flex flex-col items-center gap-6 py-24 text-center">
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          {/* ══ Left: item list ══ */}
          <div>
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto] border-b border-gray-200 pb-3 mb-2">
              <span className="text-[11px] tracking-widest uppercase text-gray-500">
                Sản phẩm
              </span>
              <span className="text-[11px] tracking-widest uppercase text-gray-500 text-right">
                Tổng cộng
              </span>
            </div>

            {/* Items */}
            <ul>
              {items.map((item) => {
                const key = cartKey(item);
                const isRemoving = removingId === key;
                return (
                  <li
                    key={key}
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={
                      isRemoving
                        ? { maxHeight: "0", opacity: 0, marginBottom: 0 }
                        : { maxHeight: "260px" }
                    }
                  >
                    <div
                      className="grid grid-cols-[auto_1fr_auto] gap-5 py-6 border-b border-gray-200"
                      style={
                        isRemoving
                          ? {
                              animation: "cartItemOut 0.25s ease-in forwards",
                            }
                          : undefined
                      }
                    >
                      {/* Thumbnail */}
                      <div className="relative w-24 h-28 shrink-0 bg-gray-100 overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-sm font-medium uppercase tracking-wide leading-snug line-clamp-2">
                          {item.name}
                        </p>
                        {item.color && (
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Màu:{" "}
                            <span className="text-black">{item.color}</span>
                          </p>
                        )}
                        {item.size && (
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Cỡ:{" "}
                            <span className="font-medium text-black">
                              {item.size}
                            </span>
                          </p>
                        )}
                        <p className="text-xs text-black mt-0.5">
                          {item.price.toLocaleString("vi-VN")}₫
                        </p>

                        {/* Qty stepper + trash */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-gray-300">
                            <button
                              onClick={() => {
                                if (item.quantity - 1 < 1) {
                                  triggerRemove(key, item);
                                } else {
                                  updateQuantity(item, item.quantity - 1);
                                }
                              }}
                              disabled={isRemoving}
                              className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 transition disabled:opacity-40"
                            >
                              −
                            </button>
                            <span className="w-10 text-center text-sm select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item, item.quantity + 1)
                              }
                              disabled={isRemoving}
                              className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 transition disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => triggerRemove(key, item)}
                            disabled={isRemoving}
                            className="text-gray-400 hover:text-red-500 transition disabled:opacity-40"
                            aria-label="Xóa sản phẩm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Line total */}
                      <div className="text-sm font-medium text-right self-start pt-1 whitespace-nowrap">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Continue shopping */}
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 mt-6 text-xs tracking-widest uppercase text-black hover:underline"
            >
              <ArrowLeft size={14} />
              Tiếp tục mua sắm
            </Link>
          </div>

          {/* ══ Right: order summary ══ */}
          <div className="sticky top-6">
            {/* Totals */}
            <div className="border-b border-gray-200 pb-5 mb-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-semibold uppercase tracking-wide">
                  Tổng tiền hàng
                </span>
                <span>{total.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between text-sm gap-4">
                <div>
                  <span className="font-semibold uppercase tracking-wide">
                    Tổng phụ
                  </span>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    Thuế và phí vận chuyển được tính ở bước tiếp theo
                  </p>
                </div>
                <span className="shrink-0">
                  {total.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              className="block w-full bg-black text-white text-center py-4 text-xs tracking-widest uppercase hover:bg-gray-800 transition"
            >
              Thanh toán
            </Link>

            {/* Order note (collapsible) */}
            <div className="mt-5 border-t border-gray-200 pt-4">
              <button
                onClick={() => setNoteOpen((o) => !o)}
                className="flex items-center gap-1.5 text-xs tracking-widest uppercase hover:underline"
              >
                <Plus
                  size={13}
                  className={`transition-transform duration-200 ${noteOpen ? "rotate-45" : ""}`}
                />
                Ghi chú đơn hàng
              </button>
              {noteOpen && (
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ghi chú cho đơn hàng của bạn..."
                  rows={3}
                  className="mt-3 w-full border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:border-black transition"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
