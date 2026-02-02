"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  image2?: string;
  colors: string[];
  isOnSale?: boolean;
  saleLabel?: string;
}

export default function ProductCard({
  id,
  name,
  brand,
  price,
  compareAtPrice,
  image,
  image2,
  colors,
  isOnSale,
  saleLabel = "ĐANG GIẢM GIÁ",
}: ProductCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  const displayImage = isHovering && image2 ? image2 : image;

  return (
    <Link href={`/catalog/${id}`}>
      <div className="group cursor-pointer">
        {/* Image Container */}
        <div
          className="relative bg-gray-100 aspect-square mb-3 overflow-hidden rounded-lg"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Image
            src={displayImage}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Sale Badge */}
          {isOnSale && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
              {saleLabel}
            </div>
          )}

          {/* Quick Add Button (on hover) */}
          {isHovering && (
            <div className="absolute inset-0 flex items-end justify-center pb-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="bg-black text-white px-6 py-2 rounded font-medium text-sm hover:bg-gray-800 transition flex items-center space-x-2"
              >
                <ShoppingCart size={16} />
                <span>Thêm nhanh</span>
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Brand */}
          <p className="text-xs font-bold text-black uppercase mb-1">{brand}</p>

          {/* Name */}
          <h3 className="text-sm font-bold uppercase mb-2 line-clamp-2 group-hover:underline text-black">
            {name}
          </h3>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-2 text-black">
            <span className="text-base font-bold">
              ₫{price.toLocaleString("vi-VN")}
            </span>
            {compareAtPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₫{compareAtPrice.toLocaleString("vi-VN")}
              </span>
            )}
          </div>

          {/* Sale Label */}
          {isOnSale && (
            <p className="text-xs text-red-600 font-bold mb-3">{saleLabel}</p>
          )}

          {/* Color Swatches */}
          <div className="flex items-center space-x-1.5 mb-1">
            {colors.map((color, idx) => (
              <div
                key={idx}
                className="w-4 h-4 rounded-full border border-gray-300"
                title={color}
                style={{
                  backgroundColor:
                    color === "Đen"
                      ? "#000"
                      : color === "Trắng"
                        ? "#fff"
                        : color === "Navy"
                          ? "#001a4d"
                          : color === "Kem"
                            ? "#f5e6d3"
                            : "#ccc",
                }}
              />
            ))}
          </div>

          {/* Color Names */}
          <p className="text-xs text-gray-600">
            {colors.slice(0, 3).join(" ")}
            {colors.length > 3 && ` +${colors.length - 3}`}
          </p>
        </div>
      </div>
    </Link>
  );
}
