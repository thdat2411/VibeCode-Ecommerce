"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/lib/api/catalog";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  initialColor?: string;
  // For sample products from landing page
  id?: string;
  name?: string;
  brand?: string;
  price?: number;
  compareAtPrice?: number;
  image?: string;
  image2?: string;
  colors?: string[];
  isOnSale?: boolean;
  saleLabel?: string;
}

export default function ProductModal({
  isOpen,
  onClose,
  product,
  initialColor,
  id,
  name: propName,
  brand: propBrand,
  price: propPrice,
  compareAtPrice: propCompareAtPrice,
  image: propImage,
  image2: propImage2,
  colors: propColors,
  isOnSale: propIsOnSale,
  saleLabel: propSaleLabel,
}: ProductModalProps) {
  // Use product data if available, otherwise use individual props
  const colors =
    product?.variantOptions?.find((opt) => opt.name === "Color")?.values ||
    propColors ||
    [];
  const displayName = product?.name || propName || "";
  const displayBrand = propBrand || "THE NEW ORIGINALS";
  const displayPrice = propPrice || product?.price || 0;
  const displayCompareAtPrice =
    propCompareAtPrice ||
    (product?.price && product.price > 500000 ? product.price : undefined);
  const displayIsOnSale =
    propIsOnSale ||
    (displayPrice > 500000 && displayCompareAtPrice !== undefined);
  const displaySaleLabel = propSaleLabel || "ĐANG GIẢM GIÁ";
  const displayImage = propImage || product?.thumbnailImage || "";
  const displayImage2 = propImage2;

  const [selectedColor, setSelectedColor] = useState(initialColor || colors[0]);
  const [selectedSize, setSelectedSize] = useState("XS");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Get images for selected color
  const getColorImages = (color: string) => {
    if (product?.variantImages) {
      const variantImage = product.variantImages.find(
        (vi) => vi.variantType === "Color" && vi.variantValue === color,
      );
      return variantImage?.images || [product.thumbnailImage];
    }
    return [propImage || ""];
  };

  // Get thumbnail for color
  const getColorThumbnail = (color: string) => {
    const images = getColorImages(color);
    return images[0];
  };

  const sizes = ["XS", "S", "M", "L", "XL", "2XL"];
  const images = getColorImages(selectedColor);
  const displayImageUrl = images[selectedImageIndex] || displayImage;

  const hasDiscount = displayPrice > 500000;
  const discountPrice = hasDiscount ? displayPrice * 0.5 : displayPrice;
  const finalPrice = hasDiscount ? discountPrice : displayPrice;
  const finalCompareAtPrice = hasDiscount
    ? displayPrice
    : displayCompareAtPrice;
  const finalIsOnSale = hasDiscount || displayIsOnSale;

  // Reset image index when color changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedColor]);

  if (!isOpen) return null;

  // Guard: if no product data and no name provided, don't render
  if (!product && !propName) {
    return null;
  }

  const handleAddToCart = () => {
    // TODO: Add to cart logic
    console.log({
      productId: product?.id || id,
      color: selectedColor,
      size: selectedSize,
      quantity,
    });
    onClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 ${
          isClosing
            ? "animate-[backdropFadeOut_0.3s_ease-in_forwards]"
            : "animate-[backdropFadeIn_0.3s_ease-out_forwards]"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 w-full h-full ${
          isClosing ? "pointer-events-none" : ""
        }`}
      >
        <div
          className={`relative bg-white rounded-lg shadow-xl lg:w-[65%] lg:h-fit h-full overflow-y-auto ${
            isClosing
              ? "animate-[modalScaleOut_0.3s_ease-in_forwards]"
              : "animate-[modalScaleIn_0.3s_ease-out_forwards]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={
              isHovering
                ? { animation: "scale-110 0.3s ease-out forwards" }
                : { animation: "scale-110-reverse 0.3s ease-out forwards" }
            }
            className="absolute top-4 right-4 z-10 h-10 w-10 bg-black border border-black flex items-center justify-center rounded"
            aria-label="Close modal"
          >
            <span
              style={
                isHovering
                  ? {
                      animation: "spin-180 0.3s linear 1",
                      color: "white",
                    }
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

          {/* Modal Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-8">
            {/* Left: Product Images */}
            <div className="flex flex-col gap-3 md:gap-4">
              {/* Main Image */}
              <div className="relative bg-gray-100 aspect-square overflow-hidden rounded">
                <Image
                  src={displayImageUrl}
                  alt={displayName}
                  fill
                  className="object-cover transition-all duration-500"
                  sizes="w-full h-full"
                />

                {/* Sale Badge */}
                {finalIsOnSale && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs ">
                    {displaySaleLabel}
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 bg-gray-100 rounded cursor-pointer border-2 transition ${
                        selectedImageIndex === idx
                          ? "border-black"
                          : "border-gray-300 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`View ${idx + 1}`}
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="flex flex-col gap-3 md:gap-6">
              {/* Brand & Name */}
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1 md:mb-2 tracking-widest">
                  {displayBrand}
                </p>
                <h2 className="text-base md:text-xl lg:text-2xl  text-black uppercase mb-1 md:mb-2">
                  {displayName}
                </h2>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-base md:text-lg lg:text-2xl  text-black">
                  ₫{finalPrice.toLocaleString("vi-VN")}
                </span>
                {finalCompareAtPrice && (
                  <span className="text-xs md:text-sm text-gray-400 line-through">
                    ₫{finalCompareAtPrice.toLocaleString("vi-VN")}
                  </span>
                )}
              </div>

              {/* Sale Label */}
              {finalIsOnSale && (
                <p className="text-xs md:text-sm  text-red-600">
                  {displaySaleLabel}
                </p>
              )}

              {/* Color Selection with Thumbnails */}
              <div>
                <label className="block text-xs md:text-sm text-black mb-2 md:mb-3 uppercase">
                  Màu sắc — {selectedColor}
                </label>
                <div className="flex gap-2 md:gap-3 flex-wrap">
                  {colors.map((color) => {
                    const thumbnail = getColorThumbnail(color);
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full border-2 overflow-hidden transition ${
                          selectedColor === color
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
                          sizes="56px"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-xs md:text-sm  text-black mb-2 md:mb-3 uppercase">
                  Cỡ - XS
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-1 md:py-2 px-1 border-2 rounded text-xs md:text-sm font-medium transition ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 text-black hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div>
                <label className="block text-xs md:text-sm  text-black mb-2 md:mb-3 uppercase">
                  Số lượng
                </label>
                <div className="flex items-center border border-black w-fit rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 md:px-4 py-1 md:py-2 hover:bg-gray-100 text-black transition text-base md:text-lg"
                  >
                    −
                  </button>
                  <span className="px-4 md:px-6 py-1 md:py-2  text-black text-sm md:text-base">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 md:px-4 py-1 md:py-2 hover:bg-gray-100 text-black transition text-base md:text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-2 md:gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-black text-white px-4 md:px-6 py-2 md:py-3 rounded  hover:bg-gray-800 transition flex items-center justify-center gap-2 uppercase text-xs md:text-sm"
                >
                  <ShoppingCart size={16} />
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={onClose}
                  className="px-4 md:px-6 py-2 md:py-3 border-2 border-black text-black rounded  hover:bg-black hover:text-white transition uppercase text-xs md:text-sm"
                >
                  Đóng
                </button>
              </div>

              {/* Additional Info */}
              <div className="pt-3 md:pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-500">
                  Sản phẩm sẽ được giao trong vòng 3-5 ngày làm việc
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
