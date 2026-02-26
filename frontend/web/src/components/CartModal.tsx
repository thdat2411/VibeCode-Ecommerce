"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { getProducts, type Product } from "@/lib/api/catalog";
import { cartKey } from "@/lib/api/cart";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, total, removeItem, updateQuantity } = useCart();
  const { authenticated } = useAuth();
  const [isClosing, setIsClosing] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relSlideIndex, setRelSlideIndex] = useState(0);
  const REL_VISIBLE = 2;

  // Fetch related products for "CÓ THỂ BẠN SẼ THÍCH"
  useEffect(() => {
    if (isOpen) {
      getProducts()
        .then((products) => {
          const cartIds = new Set(items.map((i) => i.productId));
          const candidates = products.filter((p) => !cartIds.has(p.id));
          setRelatedProducts(candidates);
          setRelSlideIndex(0);
        })
        .catch(() => setRelatedProducts([]));
    }
  }, [isOpen, items]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const isEmpty = items.length === 0;

  return createPortal(
    <>
      {/* Backdrop — dims & blocks entire page, click outside drawer closes modal */}
      <div
        className={`fixed inset-0 z-[200] cursor-pointer pointer-events-auto ${
          isClosing
            ? "animate-[backdropFadeOut_0.3s_ease-in_forwards]"
            : "animate-[backdropFadeIn_0.3s_ease-out_forwards]"
        }`}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer — slides in from the right */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-[201] flex flex-col shadow-2xl ${
          isClosing
            ? "animate-[slideOutRight_0.3s_ease-in_forwards]"
            : "animate-[slideInRight_0.3s_ease-out_forwards]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <span className="text-xs tracking-widest uppercase text-black">
            {items.length} SẢN PHẨM
          </span>

          {/* Close button — identical to ProductModal */}
          <button
            onClick={handleClose}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={
              isHovering
                ? { animation: "scale-110 0.3s ease-out forwards" }
                : { animation: "scale-110-reverse 0.3s ease-out forwards" }
            }
            className="h-10 w-10 bg-black border border-black flex items-center justify-center rounded"
            aria-label="Đóng giỏ hàng"
          >
            <span
              style={
                isHovering
                  ? { animation: "spin-180 0.3s linear 1", color: "white" }
                  : {
                      animation: "spin-180-reverse 0.3s linear 1",
                      color: "white",
                    }
              }
              className="inline-block text-xl"
            >
              ✕
            </span>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div
          className="flex-1 min-h-0 overflow-y-auto"
          style={{ scrollbarGutter: "stable" }}
        >
          {isEmpty ? (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center h-full gap-6 px-6 text-center">
              <p className="text-xs tracking-widest uppercase text-gray-500">
                GIỎ HÀNG CỦA BẠN ĐANG TRỐNG
              </p>
              <div className="flex flex-col gap-3 w-full max-w-[260px]">
                {!authenticated ? (
                  <Link
                    href="/auth/signin"
                    onClick={handleClose}
                    className="w-full bg-black text-white py-3 text-xs tracking-widest uppercase text-center hover:bg-gray-800 transition"
                  >
                    ĐĂNG NHẬP
                  </Link>
                ) : null}
                <Link
                  href="/catalog"
                  onClick={handleClose}
                  className="w-full border border-black text-black py-3 text-xs tracking-widest uppercase text-center hover:bg-black hover:text-white transition"
                >
                  TIẾP TỤC MUA SẮM
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col min-h-0">
              {/* ── Cart items ── */}
              <ul className="px-5">
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
                        className="flex gap-4 py-5 border-b border-gray-300"
                        style={
                          isRemoving
                            ? {
                                animation: "cartItemOut 0.25s ease-in forwards",
                              }
                            : undefined
                        }
                      >
                        {/* Thumbnail — taller for more presence */}
                        <div className="relative w-28 h-32 shrink-0 bg-gray-100 overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.png"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="108px"
                          />
                        </div>

                        {/* Info + controls */}
                        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                          {/* Name */}
                          <p className="text-xs uppercase tracking-wide text-black leading-snug line-clamp-2">
                            {item.name}
                          </p>

                          {/* Size / Color — always reserve space with placeholder rows */}
                          <div className="flex flex-col gap-1">
                            <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                              <span className="text-black">Màu: </span>
                              {item.color ? (
                                <span className="inline-flex items-center gap-1 text-black">
                                  {item.color}
                                </span>
                              ) : (
                                <span className="text-black">—</span>
                              )}
                            </p>
                            <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                              <span className="text-black">Size: </span>
                              {item.size ? (
                                <span className="font-medium text-black">
                                  {item.size}
                                </span>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </p>
                          </div>

                          {/* Price */}
                          <p className="text-xs font-medium text-black uppercase">
                            ₫{item.price.toLocaleString("vi-VN")}
                          </p>

                          {/* Qty controls */}
                          <div className="flex items-center gap-3 mt-auto ">
                            <div className="flex items-center border border-black ">
                              <button
                                onClick={() => {
                                  if (item.quantity - 1 < 1) {
                                    // Quantity hits 0 → animate out then remove
                                    if (removingId) return;
                                    setRemovingId(key);
                                    setTimeout(() => {
                                      removeItem(item);
                                      setRemovingId(null);
                                    }, 320);
                                  } else {
                                    updateQuantity(item, item.quantity - 1);
                                  }
                                }}
                                disabled={isRemoving}
                                className="px-2 py-1 text-sm text-black hover:bg-gray-100 transition disabled:opacity-40"
                              >
                                −
                              </button>
                              <span className="px-6 text-xs text-black">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item, item.quantity + 1)
                                }
                                disabled={isRemoving}
                                className="px-2 py-1 text-sm text-black hover:bg-gray-100 transition disabled:opacity-40"
                              >
                                +
                              </button>
                            </div>

                            {/* Delete */}
                            <button
                              onClick={() => {
                                if (removingId) return;
                                setRemovingId(key);
                                setTimeout(() => {
                                  removeItem(item);
                                  setRemovingId(null);
                                }, 320);
                              }}
                              disabled={isRemoving}
                              className="ml-auto text-gray-700 hover:text-red-500 transition disabled:opacity-40"
                              aria-label="Xóa sản phẩm"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* ── GHI CHÚ ĐƠN HÀNG (collapsible) ── */}
              <div className="border-t border-gray-200 mx-5">
                <button
                  onClick={() => setNoteOpen((v) => !v)}
                  className="flex items-center justify-between w-full py-3 text-xs uppercase tracking-widest text-black"
                >
                  <span>GHI CHÚ ĐƠN HÀNG —</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      noteOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Animated reveal */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    noteOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={4}
                    placeholder="THÊM GHI CHÚ Ở ĐÂY"
                    className="w-full border border-gray-300 p-3 text-xs text-black uppercase tracking-wide resize-none focus:outline-none focus:border-black placeholder:text-gray-400 mb-3"
                  />
                </div>
              </div>

              {/* ── CÓ THỂ BẠN SẼ THÍCH ── */}
              {relatedProducts.length > 0 && (
                <div className="border-t border-gray-200 px-5 py-4">
                  <p className="text-xs uppercase tracking-widest text-black mb-3">
                    CÓ THỂ BẠN SẼ THÍCH
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {relatedProducts
                      .slice(relSlideIndex, relSlideIndex + REL_VISIBLE)
                      .map((product) => (
                        <Link
                          key={product.id}
                          href={`/catalog/${product.id}`}
                          onClick={handleClose}
                          className="group block"
                        >
                          <div className="relative aspect-square bg-gray-100 overflow-hidden mb-2">
                            <Image
                              src={product.thumbnailImage || "/placeholder.png"}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 420px) 45vw, 180px"
                            />
                            {product.compareAtPrice && (
                              <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 uppercase tracking-wide">
                                ĐANG GIẢM GIÁ
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] uppercase tracking-wide text-black line-clamp-2 leading-tight">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-gray-600 mt-0.5">
                            ₫{product.price.toLocaleString("vi-VN")}
                          </p>
                        </Link>
                      ))}
                  </div>
                  {/* Navigation arrows */}
                  {relatedProducts.length > REL_VISIBLE && (
                    <div className="flex items-center justify-center gap-6 mt-4">
                      <button
                        onClick={() =>
                          setRelSlideIndex((i) => Math.max(0, i - REL_VISIBLE))
                        }
                        disabled={relSlideIndex === 0}
                        className="text-black disabled:text-gray-300 hover:text-gray-500 transition"
                        aria-label="Trước"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() =>
                          setRelSlideIndex((i) =>
                            Math.min(
                              relatedProducts.length - REL_VISIBLE,
                              i + REL_VISIBLE,
                            ),
                          )
                        }
                        disabled={
                          relSlideIndex + REL_VISIBLE >= relatedProducts.length
                        }
                        className="text-black disabled:text-gray-300 hover:text-gray-500 transition"
                        aria-label="Tiếp"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Sticky footer (only when cart has items) ── */}
        {!isEmpty && (
          <div className="shrink-0 border-t border-gray-200 px-5 py-4 bg-white flex flex-col gap-2">
            {/* Subtotal rows */}
            <div className="flex justify-between text-xs uppercase tracking-wide text-black">
              <span>TỔNG TIỀN HÀNG</span>
              <span>₫{total.toLocaleString("vi-VN")}</span>
            </div>
            <div className="flex justify-between text-xs uppercase tracking-wide text-black">
              <span>TỔNG PHỤ</span>
              <span>₫{total.toLocaleString("vi-VN")}</span>
            </div>

            <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">
              THUẾ VÀ PHÍ VẬN CHUYỂN ĐƯỢC TÍNH Ở BƯỚC TIẾP THEO
            </p>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 mt-2">
              <Link
                href="/checkout"
                onClick={handleClose}
                className="w-full bg-black text-white py-3 text-xs tracking-widest uppercase text-center hover:bg-gray-800 transition"
              >
                THANH TOÁN
              </Link>
              <Link
                href="/cart"
                onClick={handleClose}
                className="w-full border border-black text-black py-3 text-xs tracking-widest uppercase text-center hover:bg-black hover:text-white transition"
              >
                XEM GIỎ HÀNG
              </Link>
            </div>
          </div>
        )}
      </div>
    </>,
    document.body,
  );
}
