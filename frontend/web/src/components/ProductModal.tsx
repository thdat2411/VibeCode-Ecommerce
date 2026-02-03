"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ShoppingCart } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function ProductModal({
  isOpen,
  onClose,
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
}: ProductModalProps) {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState("XS");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const sizes = ["XS", "S", "M", "L", "XL", "2XL"];
  const images = image2 ? [image, image2] : [image];
  const displayImage = images[selectedImageIndex];

  if (!isOpen) return null;

  const handleAddToCart = () => {
    // TODO: Add to cart logic
    console.log({
      productId: id,
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
            className={`absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors ${
              isHovering
                ? "animate-[spinIn_0.4s_ease-in-out_forwards]"
                : "animate-[spinOut_0.4s_ease-in-out_forwards]"
            }`}
            aria-label="Close modal"
          >
            <X size={24} className="text-black" />
          </button>

          {/* Modal Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-8">
            {/* Left: Product Images */}
            <div className="flex flex-col gap-3 md:gap-4">
              {/* Main Image */}
              <div className="relative bg-gray-100 aspect-square overflow-hidden rounded">
                <Image
                  src={displayImage}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="w-full h-full"
                />

                {/* Sale Badge */}
                {isOnSale && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs ">
                    {saleLabel}
                  </div>
                )}
              </div>

              {/* Thumbnail */}
              {image2 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedImageIndex(0)}
                    className={`relative w-16 h-16 bg-gray-100 rounded cursor-pointer border-2 transition ${
                      selectedImageIndex === 0
                        ? "border-black"
                        : "border-gray-300 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image}
                      alt="View 1"
                      fill
                      className="object-cover rounded"
                      sizes="64px"
                    />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(1)}
                    className={`relative w-16 h-16 bg-gray-100 rounded cursor-pointer border-2 transition ${
                      selectedImageIndex === 1
                        ? "border-black"
                        : "border-gray-300 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image2}
                      alt="View 2"
                      fill
                      className="object-cover rounded"
                      sizes="64px"
                    />
                  </button>
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="flex flex-col gap-3 md:gap-6">
              {/* Brand & Name */}
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1 md:mb-2 tracking-widest">
                  {brand}
                </p>
                <h2 className="text-base md:text-xl lg:text-2xl  text-black uppercase mb-1 md:mb-2">
                  {name}
                </h2>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-base md:text-lg lg:text-2xl  text-black">
                  ₫{price.toLocaleString("vi-VN")}
                </span>
                {compareAtPrice && (
                  <span className="text-xs md:text-sm text-gray-400 line-through">
                    ₫{compareAtPrice.toLocaleString("vi-VN")}
                  </span>
                )}
              </div>

              {/* Sale Label */}
              {isOnSale && (
                <p className="text-xs md:text-sm  text-red-600">{saleLabel}</p>
              )}

              {/* Color Selection */}
              <div>
                <label className="block text-xs md:text-sm  text-black mb-2 md:mb-3 uppercase">
                  Màu sắc
                </label>
                <div className="flex gap-2 md:gap-3 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 md:px-4 py-1 md:py-2 border-2 rounded text-xs md:text-sm font-medium transition ${
                        selectedColor === color
                          ? "border-black bg-black text-white"
                          : "border-gray-300 text-black hover:border-black"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
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
