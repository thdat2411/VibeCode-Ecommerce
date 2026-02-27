"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Eye } from "lucide-react";
import ProductModal from "./ProductModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayImage = isHovering && image2 ? image2 : image;

  return (
    <>
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
            <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs">
              {saleLabel}
            </div>
          )}

          {/* Quick View & Add to Cart Buttons (on hover) */}
          {isHovering && (
            <div className="absolute inset-0 flex items-end justify-end gap-2 pb-4 px-2 bg-black/20">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className=" bg-white text-black px-3 py-2 rounded  text-xs hover:bg-gray-100 transition flex items-center justify-center space-x-1"
              >
                <Eye size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="bg-black text-white px-3 py-2 rounded  text-xs hover:bg-gray-800 transition flex items-center justify-center space-x-1"
              >
                <ShoppingCart size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <Link href={`/catalog/${id}`}>
          <div className="cursor-pointer">
            {/* Brand */}
            <p className="text-xs  text-black uppercase mb-1">{brand}</p>

            {/* Name */}
            <h3 className="text-xs uppercase mb-2 line-clamp-2 group-hover:underline text-black">
              {name}
            </h3>

            {/* Price */}
            <div className="flex items-center space-x-2 mb-2 text-black">
              <span className="text-[10px] ">
                ₫{price.toLocaleString("vi-VN")}
              </span>
              {compareAtPrice && (
                <span className="text-[10px] text-red-600 line-through">
                  ₫{compareAtPrice.toLocaleString("vi-VN")}
                </span>
              )}
            </div>

            {/* Sale Label */}
            {isOnSale && (
              <p className="text-xs text-red-600  mb-3">{saleLabel}</p>
            )}
          </div>
        </Link>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        id={id}
        name={name}
        brand={brand}
        price={price}
        compareAtPrice={compareAtPrice}
        image={image}
        image2={image2}
        colors={colors}
        isOnSale={isOnSale}
        saleLabel={saleLabel}
      />
    </>
  );
}
