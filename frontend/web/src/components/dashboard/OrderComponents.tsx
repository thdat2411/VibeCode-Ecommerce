"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductById } from "@/lib/api/catalog";

export interface Order {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: string;
  // flat fields from EF model
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  // legacy nested (fallback)
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const statusLabel = (status: string) => {
  switch (status) {
    case "processing":
      return "ĐANG XỬ LÝ";
    case "confirmed":
      return "ĐÃ XÁC NHẬN";
    case "shipped":
      return "ĐANG GIAO";
    case "delivered":
      return "ĐÃ NHẬN";
    case "cancelled":
      return "ĐÃ HỦY";
    default:
      return status.toUpperCase();
  }
};

const statusColor = (status: string) => {
  switch (status) {
    case "processing":
      return "text-yellow-600";
    case "confirmed":
      return "text-blue-500";
    case "shipped":
      return "text-blue-600";
    case "delivered":
      return "text-green-600";
    case "cancelled":
      return "text-red-500";
    default:
      return "text-gray-600";
  }
};

const statusDot = (status: string) => {
  switch (status) {
    case "processing":
      return "bg-yellow-400";
    case "confirmed":
      return "bg-blue-400";
    case "shipped":
      return "bg-blue-500";
    case "delivered":
      return "bg-green-500";
    case "cancelled":
      return "bg-red-400";
    default:
      return "bg-gray-400";
  }
};

const getAddress = (order: Order) => {
  if (order.street) {
    return {
      street: order.street,
      city: order.city ?? "",
      state: order.state ?? "",
      postalCode: order.postalCode ?? "",
      country: order.country ?? "",
    };
  }
  return (
    order.shippingAddress ?? {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    }
  );
};

// ── OrderListRow — compact clickable card ─────────────────────────────────────

export const OrderListRow = ({
  order,
  onClick,
}: {
  order: Order;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full text-left border border-gray-200 p-5 hover:border-gray-400 hover:bg-gray-50 transition-all group"
  >
    <div className="flex items-center justify-between">
      {/* Left: id + date */}
      <div className="flex-1 min-w-0">
        <p className="text-xs tracking-widest text-gray-500 uppercase mb-1">
          Đơn hàng
        </p>
        <p className="text-sm font-medium text-black">
          #{order.id.substring(0, 8).toUpperCase()}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(order.createdAt).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}{" "}
          &bull; {order.items.length} sản phẩm
        </p>
      </div>

      {/* Middle: status */}
      <div className="flex-1 flex items-center gap-2 px-4">
        <span
          className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot(order.status)}`}
        />
        <span
          className={`text-xs font-medium tracking-wider ${statusColor(order.status)}`}
        >
          {statusLabel(order.status)}
        </span>
      </div>

      {/* Right: total + arrow */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs tracking-widest text-gray-500 uppercase mb-1">
            Tổng cộng
          </p>
          <p className="text-sm font-medium text-black">
            {order.total.toLocaleString("vi-VN")} ₫
          </p>
        </div>
        <svg
          className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  </button>
);

// ── OrderDetail — full detail with back arrow + product thumbnails ────────────

export const OrderDetail = ({
  order,
  onBack,
}: {
  order: Order;
  onBack: () => void;
}) => {
  const address = getAddress(order);
  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = order.total - subtotal;

  // Fetch thumbnails keyed by productId
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  useEffect(() => {
    const uniqueIds = [...new Set(order.items.map((i) => i.productId))];
    Promise.all(
      uniqueIds.map((id) =>
        getProductById(id)
          .then((p) => ({ id, url: p.thumbnailImage }))
          .catch(() => ({ id, url: "" })),
      ),
    ).then((results) => {
      setThumbnails(Object.fromEntries(results.map((r) => [r.id, r.url])));
    });
  }, [order.id]);

  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs tracking-widest text-gray-500 hover:text-black transition mb-6 group"
      >
        <svg
          className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>TẤT CẢ ĐƠN HÀNG</span>
      </button>

      {/* Header */}
      <div className="border border-gray-200 p-6 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-6 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-500 tracking-widest uppercase mb-1">
              Đơn hàng
            </p>
            <p className="text-sm font-medium text-black">
              #{order.id.substring(0, 8).toUpperCase()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 tracking-widest uppercase mb-1">
              Ngày đặt
            </p>
            <p className="text-sm font-medium text-black">
              {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 tracking-widest uppercase mb-1">
              Trạng thái
            </p>
            <span
              className={`text-sm font-medium ${statusColor(order.status)}`}
            >
              {statusLabel(order.status)}
            </span>
          </div>
          <div className="sm:text-right">
            <p className="text-xs text-gray-500 tracking-widest uppercase mb-1">
              Tổng cộng
            </p>
            <p className="text-sm font-medium text-black">
              {order.total.toLocaleString("vi-VN")} ₫
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="mt-6">
          <p className="text-xs text-gray-500 tracking-widest uppercase mb-4">
            Sản phẩm
          </p>
          <div className="space-y-0">
            {order.items.map((item, idx) => {
              const thumb = thumbnails[item.productId];
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0"
                >
                  {/* Thumbnail — links to product detail */}
                  <Link
                    href={`/catalog/${item.productId}`}
                    className="flex-shrink-0 w-14 h-14 bg-gray-100 overflow-hidden block hover:opacity-80 transition-opacity"
                  >
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt={item.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 animate-pulse" />
                    )}
                  </Link>

                  {/* Name + price per unit — links to product detail */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/catalog/${item.productId}`}
                      className="text-sm text-black font-medium hover:underline underline-offset-2 line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.price.toLocaleString("vi-VN")} ₫ &times;{" "}
                      {item.quantity}
                    </p>
                  </div>

                  {/* Line total */}
                  <p className="text-sm font-medium text-black ml-2 flex-shrink-0">
                    {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Totals */}
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
          <div className="flex justify-between text-xs text-gray-500 tracking-wider">
            <span>TẠM TÍNH</span>
            <span>{subtotal.toLocaleString("vi-VN")} ₫</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 tracking-wider">
            <span>VẬN CHUYỂN</span>
            <span>
              {shipping > 0
                ? `${shipping.toLocaleString("vi-VN")} ₫`
                : "Miễn phí"}
            </span>
          </div>
          <div className="flex justify-between text-sm font-medium text-black pt-2 border-t border-gray-200">
            <span className="tracking-wider">TỔNG CỘNG</span>
            <span>{order.total.toLocaleString("vi-VN")} ₫</span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      {(address.street || address.city) && (
        <div className="border border-gray-200 p-6">
          <p className="text-xs text-gray-500 tracking-widest uppercase mb-4">
            Địa chỉ giao hàng
          </p>
          <div className="text-sm text-black space-y-1">
            {address.street && <p>{address.street}</p>}
            {(address.city || address.state) && (
              <p>{[address.city, address.state].filter(Boolean).join(", ")}</p>
            )}
            {address.postalCode && <p>{address.postalCode}</p>}
            {address.country && <p>{address.country}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Pagination ────────────────────────────────────────────────────────────────

export const Pagination = ({
  currentPage,
  totalPages,
  onPage,
}: {
  currentPage: number;
  totalPages: number;
  onPage: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`w-8 h-8 text-xs tracking-wider transition ${
            p === currentPage
              ? "bg-black text-white"
              : "text-gray-600 hover:text-black hover:bg-gray-100"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

// ── Legacy exports (kept for backward compat) ─────────────────────────────────

export const OrderDetailField = ({
  label,
  value,
  textAlign = "left",
}: {
  label: string;
  value: string;
  textAlign?: "left" | "right";
}) => (
  <div className={textAlign === "right" ? "text-right" : ""}>
    <p className="text-xs text-gray-600 tracking-wider mb-1 uppercase">
      {label}
    </p>
    <p className="text-sm text-black font-medium">{value}</p>
  </div>
);

export const OrderCard = ({ order }: { order: Order }) => (
  <div className="border border-gray-200 p-6">
    <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
      <OrderDetailField
        label="ĐƠN HÀNG"
        value={`#${order.id.substring(0, 8).toUpperCase()}`}
      />
      <OrderDetailField
        label="NGÀY"
        value={new Date(order.createdAt).toLocaleDateString("vi-VN")}
      />
      <div>
        <p className="text-xs text-gray-600 tracking-wider mb-1 uppercase">
          TRẠNG THÁI
        </p>
        <p className={`text-sm font-medium ${statusColor(order.status)}`}>
          {statusLabel(order.status)}
        </p>
      </div>
      <OrderDetailField
        label="TỔNG CỘNG"
        value={`${order.total.toLocaleString("vi-VN")} ₫`}
        textAlign="right"
      />
    </div>
    <div className="space-y-2">
      {order.items.map((item, idx) => (
        <div key={idx} className="flex justify-between text-sm">
          <span className="text-gray-700">
            {item.name} × {item.quantity}
          </span>
          <span className="text-black">
            {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const OrderHistoryRow = ({ order }: { order: Order }) => (
  <div className="border border-gray-200 p-4 hover:bg-gray-50 transition cursor-pointer">
    <div className="flex justify-between items-center">
      <div className="flex-1">
        <p className="text-sm font-medium text-black">
          #{order.id.substring(0, 8).toUpperCase()}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          {new Date(order.createdAt).toLocaleDateString("vi-VN")} &bull;{" "}
          {order.items.length} sản phẩm
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-black">
          {order.total.toLocaleString("vi-VN")} ₫
        </p>
        <p className={`text-xs mt-1 font-medium ${statusColor(order.status)}`}>
          {statusLabel(order.status)}
        </p>
      </div>
    </div>
  </div>
);
