import Image from "next/image";
import { Tag } from "lucide-react";
import { useState } from "react";
import { SHIPPING_FEE } from "./checkoutConstants";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  color?: string;
  size?: string;
}

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  const [discountCode, setDiscountCode] = useState("");

  return (
    <div className="w-full lg:w-[420px] xl:w-[460px] shrink-0 bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200">
      <div className="sticky top-0 max-h-screen overflow-y-auto px-6 py-10 lg:px-10 lg:py-12">
        {/* Items list */}
        <ul className="space-y-5 mb-7">
          {items.map((item) => (
            <li
              key={`${item.productId}|${item.size ?? ""}|${item.color ?? ""}`}
              className="flex gap-4"
            >
              <div className="relative w-[64px] h-[76px] shrink-0 bg-white border border-gray-200 overflow-hidden rounded-lg">
                <Image
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
                <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium leading-snug line-clamp-2 mb-1">
                  {item.name}
                </p>
                <p className="text-[11px] text-gray-500">
                  {[item.color, item.size].filter(Boolean).join(" / ")}
                </p>
              </div>
              <span className="text-xs shrink-0 self-start font-medium">
                {(item.price * item.quantity).toLocaleString("vi-VN")}₫
              </span>
            </li>
          ))}
        </ul>

        {/* Discount code */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Tag
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Mã giảm giá"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-sm bg-white focus:outline-none focus:border-black transition-colors rounded-lg"
            />
          </div>
          <button
            type="button"
            className="px-4 py-2.5 bg-black text-white text-xs tracking-widest uppercase hover:bg-gray-800 transition rounded-lg"
          >
            Áp dụng
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-4" />

        {/* Totals */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-black">Tổng phụ</span>
            <span className="font-medium">
              {total.toLocaleString("vi-VN")}₫
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-black">Vận chuyển</span>
            <span className="font-medium">
              {SHIPPING_FEE.toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-baseline">
          <span className="text-sm font-medium">Tổng</span>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 mr-1 uppercase tracking-widest">
              VND
            </span>
            <span className="text-xl font-semibold">
              {(total + SHIPPING_FEE).toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
