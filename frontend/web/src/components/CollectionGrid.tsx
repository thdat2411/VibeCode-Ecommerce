"use client";

import { Product } from "@/lib/api/catalog";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Eye } from "lucide-react";
import ProductModal from "./ProductModal";

interface CollectionGridProps {
  products: Product[];
}

export function CollectionGrid({ products }: CollectionGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào.</p>
      </div>
    );
  }

  // On mobile: 2 items per row, on desktop: 3 items per row with alternating layout
  const itemsPerRow = 3;
  const rows = [];
  for (let i = 0; i < products.length; i += itemsPerRow) {
    rows.push(products.slice(i, i + itemsPerRow));
  }

  return (
    <div className="space-y-4 md:space-y-6 pb-12">
      {rows.map((row, rowIndex) => {
        // Filter out undefined products
        const validProducts = row.filter((p): p is Product => p !== undefined);

        // Skip if no valid products in this row
        if (validProducts.length === 0) {
          return null;
        }

        // Determine which item should be largest based on row pattern (desktop only)
        const largeItemIndex =
          rowIndex % 4 === 0
            ? 2
            : rowIndex % 4 === 1
              ? 1
              : rowIndex % 4 === 2
                ? 0
                : 1;

        return (
          <div
            key={rowIndex}
            className="flex gap-2 md:gap-4 flex-wrap md:flex-nowrap h-auto md:h-[620px] w-full"
          >
            {/* Render based on large item position */}
            {largeItemIndex === 0 ? (
              <>
                {/* Large item first (50% width on desktop, 50% on mobile - calc to account for gap) */}
                {validProducts[0] && (
                  <div className="w-[calc(50%-4px)] md:w-1/2">
                    <ProductCard product={validProducts[0]} isLarge={true} />
                  </div>
                )}
                {/* Two small items (25% width each on desktop, 50% on mobile - calc to account for gap) */}
                {validProducts[1] && (
                  <div className="w-[calc(50%-4px)] md:w-1/4">
                    <ProductCard product={validProducts[1]} isLarge={false} />
                  </div>
                )}
                {validProducts[2] && (
                  <div className="hidden md:block md:w-1/4">
                    <ProductCard product={validProducts[2]} isLarge={false} />
                  </div>
                )}
              </>
            ) : largeItemIndex === 1 ? (
              <>
                {/* Small item (25% width on desktop, 50% on mobile - calc to account for gap) */}
                {validProducts[0] && (
                  <div className="w-[calc(50%-4px)] md:w-1/4">
                    <ProductCard product={validProducts[0]} isLarge={false} />
                  </div>
                )}
                {/* Large item middle (50% width on desktop, 50% on mobile - calc to account for gap) */}
                {validProducts[1] && (
                  <div className="w-[calc(50%-4px)] md:w-1/2">
                    <ProductCard product={validProducts[1]} isLarge={true} />
                  </div>
                )}
                {/* Small item (25% width on desktop, hidden on mobile) */}
                {validProducts[2] && (
                  <div className="hidden md:block md:w-1/4">
                    <ProductCard product={validProducts[2]} isLarge={false} />
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Two small items (25% width each on desktop, 50% on mobile - calc to account for gap) */}
                {validProducts[0] && (
                  <div className="w-[calc(50%-4px)] md:w-1/4">
                    <ProductCard product={validProducts[0]} isLarge={false} />
                  </div>
                )}
                {validProducts[1] && (
                  <div className="w-[calc(50%-4px)] md:w-1/4">
                    <ProductCard product={validProducts[1]} isLarge={false} />
                  </div>
                )}
                {/* Large item last (50% width on desktop, hidden on mobile) */}
                {validProducts[2] && (
                  <div className="hidden md:block md:w-1/2">
                    <ProductCard product={validProducts[2]} isLarge={true} />
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProductCard({
  product,
  isLarge,
}: {
  product?: Product;
  isLarge: boolean;
}) {
  // Guard against undefined product
  if (!product) {
    return null;
  }

  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Get color options
  const colorOption = product.variantOptions?.find(
    (opt) => opt.name === "Color",
  );
  const colors = colorOption?.values || [];

  // Get images for selected color or first color
  const getImages = () => {
    const colorToUse = selectedColor || (colors.length > 0 ? colors[0] : null);

    if (
      colorToUse &&
      product.variantImages &&
      product.variantImages.length > 0
    ) {
      const variantImage = product.variantImages.find(
        (vi) => vi.variantType === "Color" && vi.variantValue === colorToUse,
      );
      if (variantImage && variantImage.images) {
        return variantImage.images;
      }
    }

    return [product.thumbnailImage];
  };

  // Get thumbnail for specific color
  const getColorThumbnail = (color: string) => {
    const variantImage = product.variantImages?.find(
      (vi) => vi.variantType === "Color" && vi.variantValue === color,
    );
    return variantImage?.images?.[0] || product.thumbnailImage;
  };

  const images = getImages();
  const displayImage = isHovering && images.length > 1 ? images[1] : images[0];

  // Calculate discount
  const hasDiscount = product.price > 500000;
  const discountPrice = hasDiscount ? product.price * 0.5 : product.price;

  const handleColorClick = (e: React.MouseEvent, color: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColor(color);
  };

  return (
    <>
      <div className="group cursor-pointer h-full flex flex-col">
        {/* Image Container */}
        <div
          className={`relative bg-gray-100 overflow-hidden rounded-lg ${isLarge ? "flex-1" : "h-[280px]"}`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Image
            src={displayImage}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-300 ${isHovering ? "scale-110" : "scale-100"}`}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Sale Badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs">
              ĐANG GIẢM GIÁ
            </div>
          )}

          {/* Quick View & Add to Cart Buttons (on hover with smooth animation) */}
          <div
            className={`absolute inset-0 flex items-end justify-end gap-2 pb-4 px-2 transition-opacity duration-300 ${isHovering ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="bg-white text-black px-3 py-2 rounded text-xs hover:bg-gray-100 transition flex items-center justify-center space-x-1 transform transition-transform duration-300 hover:scale-105"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="bg-black text-white px-3 py-2 rounded text-xs hover:bg-gray-800 transition flex items-center justify-center space-x-1 transform transition-transform duration-300 hover:scale-105"
            >
              <ShoppingCart size={14} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <Link href={`/catalog/${product.id}`}>
          <div className="cursor-pointer mt-3">
            {/* Brand */}
            <p className="text-xs text-black uppercase mb-1">
              THE NEW ORIGINALS
            </p>

            {/* Name */}
            <h3 className="text-xs uppercase mb-2 line-clamp-2 group-hover:underline text-black">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center space-x-2 mb-2 text-black">
              {hasDiscount ? (
                <>
                  <span className="text-[10px]">
                    ₫{discountPrice.toLocaleString("vi-VN")}
                  </span>
                  <span className="text-[10px] text-red-600 line-through">
                    ₫{product.price.toLocaleString("vi-VN")}
                  </span>
                </>
              ) : (
                <span className="text-[10px]">
                  ₫{product.price.toLocaleString("vi-VN")}
                </span>
              )}
            </div>

            {/* Sale Label */}
            {hasDiscount && (
              <p className="text-xs text-red-600 mb-3">ĐANG GIẢM GIÁ</p>
            )}
          </div>
        </Link>

        {/* Color Thumbnail Picker */}
        {colors.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {colors.map((color) => {
              const thumbnail = getColorThumbnail(color);
              const isSelected =
                selectedColor === color ||
                (!selectedColor && color === colors[0]);

              return (
                <button
                  key={color}
                  onClick={(e) => handleColorClick(e, color)}
                  className={`relative w-10 h-10 rounded-full border-2 overflow-hidden transition ${
                    isSelected
                      ? "border-black"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                  title={color}
                >
                  <Image
                    src={thumbnail}
                    alt={color}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        initialColor={selectedColor || colors[0]}
      />
    </>
  );
}

// No need for getColorHex function anymore
