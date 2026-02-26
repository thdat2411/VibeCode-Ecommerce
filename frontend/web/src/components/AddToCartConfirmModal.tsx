"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { getProducts, type Product } from "@/lib/api/catalog";

interface AddedItem {
  name: string;
  color?: string;
  size?: string;
  price: number;
  image?: string;
  quantity: number;
}

interface AddToCartConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCart: () => void;
  item: AddedItem | null;
  excludeProductId?: string;
}

export default function AddToCartConfirmModal({
  isOpen,
  onClose,
  onOpenCart,
  item,
  excludeProductId,
}: AddToCartConfirmModalProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const VISIBLE = 3;

  useEffect(() => {
    if (!isOpen) return;
    setIsClosing(false);
    getProducts()
      .then((products) => {
        const filtered = products.filter((p) => p.id !== excludeProductId);
        setRelatedProducts(filtered);
        setSlideIndex(0);
      })
      .catch(() => setRelatedProducts([]));
  }, [isOpen, excludeProductId]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 280);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, handleClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const maxIndex = Math.max(0, relatedProducts.length - VISIBLE);
  const prev = () => setSlideIndex((i) => Math.max(0, i - 1));
  const next = () => setSlideIndex((i) => Math.min(maxIndex, i + 1));
  const visible = relatedProducts.slice(slideIndex, slideIndex + VISIBLE);

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[300] cursor-pointer pointer-events-auto ${
          isClosing
            ? "animate-[backdropFadeOut_0.28s_ease-in_forwards]"
            : "animate-[backdropFadeIn_0.28s_ease-out_forwards]"
        }`}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Centering wrapper */}
      <div className="fixed inset-0 z-[301] flex items-center justify-center p-4 pointer-events-none">
        {/* Modal panel — same height/scroll approach as ProductModal */}
        <div
          className={`relative bg-white w-full max-w-[640px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl pointer-events-auto ${
            isClosing
              ? "animate-[modalScaleOut_0.28s_ease-in_forwards]"
              : "animate-[modalScaleIn_0.28s_ease-out_forwards]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Close button — identical to ProductModal ── */}
          <button
            onClick={handleClose}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="absolute top-2 right-4 z-10 h-10 w-10 bg-black border border-black flex items-center justify-center"
            aria-label="Đóng"
          >
            <span
              style={{
                display: "inline-block",
                color: "white",
                transition: "transform 0.3s linear",
                transform: isHovering ? "rotate(180deg)" : "rotate(0deg)",
              }}
              className="text-xl leading-none"
            >
              ✕
            </span>
          </button>

          {/* ── Header ── */}
          <div className="shrink-0 px-6 pt-5 pb-4 border-b border-gray-200 pr-16">
            <p className="text-[11px] uppercase tracking-widest text-[#1a7a4a] font-medium">
              SẢN PHẨM ĐÃ ĐƯỢC THÊM VÀO GIỎ HÀNG CỦA BẠN
            </p>
          </div>

          {/* ── Scrollable body ── */}
          <div className="flex-1 overflow-y-auto">
            {/* Added item row */}
            <div className="flex items-start gap-4 px-6 py-4 border-b border-gray-200">
              <div className="relative w-16 h-16 shrink-0 bg-gray-100 overflow-hidden">
                <Image
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-black font-medium leading-tight">
                  {item.name}
                </p>
                {item.color && (
                  <p className="text-[11px] text-gray-500 uppercase mt-0.5">
                    MÀU: {item.color}
                  </p>
                )}
                {item.size && (
                  <p className="text-[11px] text-gray-500 uppercase">
                    CỠ: {item.size}
                  </p>
                )}
                <p className="text-[11px] text-gray-500 uppercase">
                  {item.price.toLocaleString("vi-VN")}₫
                </p>
                <p className="text-[11px] text-gray-500 uppercase">
                  SỐ LƯỢNG: {item.quantity}
                </p>
              </div>
              <p className="text-[11px] text-black uppercase shrink-0 font-medium">
                {item.price.toLocaleString("vi-VN")}₫
              </p>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 px-6 py-4 border-b border-gray-200">
              <button
                onClick={handleClose}
                className="bg-black text-white py-3 text-[11px] tracking-widest uppercase hover:bg-gray-800 transition"
              >
                THANH TOÁN
              </button>
              <button
                onClick={() => {
                  handleClose();
                  setTimeout(onOpenCart, 310);
                }}
                className="border border-black text-black py-3 text-[11px] tracking-widest uppercase hover:bg-black hover:text-white transition"
              >
                XEM GIỎ HÀNG
              </button>
            </div>

            {/* Related products */}
            {relatedProducts.length > 0 && (
              <div className="px-6 py-5">
                <p className="text-[11px] uppercase tracking-widest text-black mb-4">
                  CÓ THỂ BẠN SẼ THÍCH
                </p>

                <div className="grid grid-cols-3 gap-4">
                  {visible.map((product) => (
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
                          sizes="160px"
                        />
                        {product.compareAtPrice && (
                          <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] px-1.5 py-0.5 uppercase tracking-wide">
                            ĐANG GIẢM GIÁ
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] text-gray-500 uppercase tracking-wide">
                        THE NEW ORIGINALS
                      </p>
                      <p className="text-[10px] uppercase tracking-wide text-black leading-tight line-clamp-2">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[10px] text-red-600">
                          {product.price.toLocaleString("vi-VN")}₫
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-[10px] text-gray-400 line-through">
                            {product.compareAtPrice.toLocaleString("vi-VN")}₫
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Arrow navigation — stick + arrowhead (← →) */}
                {relatedProducts.length > VISIBLE && (
                  <div className="flex items-center justify-center gap-8 mt-5">
                    <button
                      onClick={prev}
                      disabled={slideIndex === 0}
                      className="text-black disabled:text-gray-300 hover:text-gray-500 transition text-2xl leading-none select-none"
                      aria-label="Trước"
                    >
                      ←
                    </button>
                    <button
                      onClick={next}
                      disabled={slideIndex >= maxIndex}
                      className="text-black disabled:text-gray-300 hover:text-gray-500 transition text-2xl leading-none select-none"
                      aria-label="Tiếp"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
