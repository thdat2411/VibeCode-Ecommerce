"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/api/cart";
import { isAuthenticated } from "@/lib/api/auth";

export interface Product {
  id: string;
  name: string;
  price: number;
  totalStock: number;
  images: string[];
}

interface AddToCartFormProps {
  product: Product;
  sizes: string[];
  colors: string[];
}

export function AddToCartForm({ product, sizes, colors }: AddToCartFormProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleAddToCart(e: React.FormEvent) {
    e.preventDefault();

    // Validate selections
    if (sizes.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      alert("Please select a color");
      return;
    }

    setLoading(true);

    try {
      await addToCart({
        productId: product.id,
        name: `${product.name}${selectedSize ? ` - ${selectedSize}` : ""}${selectedColor ? ` (${selectedColor})` : ""}`,
        price: product.price,
        image: product.images[0],
        quantity,
      });

      setSuccess(true);

      // Reset form
      setSelectedSize("");
      setSelectedColor("");
      setQuantity(1);

      // Show success for 2 seconds then reset
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleAddToCart} className="space-y-6">
      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <label className="block text-xs mb-3">Size</label>
          <div className="grid grid-cols-2 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded transition text-xs ${
                  selectedSize === size
                    ? "bg-black text-white border border-black"
                    : "border border-gray-300 hover:border-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div>
        <label className="block text-xs mb-3">SỐ LƯỢNG</label>
        <div className="flex items-center border border-gray-300 rounded w-fit">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-2 py-1 hover:bg-gray-100 transition text-base"
            disabled={quantity <= 1}
          >
            −
          </button>
          <span className="px-4 py-1 border-x border-gray-300 text-sm">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-2 py-1 hover:bg-gray-100 transition text-base"
            disabled={quantity >= product.totalStock}
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        type="submit"
        disabled={loading || product.totalStock === 0}
        className={`w-full py-4 rounded font-semibold transition ${
          success
            ? "bg-green-600 text-white"
            : product.totalStock === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {loading
          ? "Adding to cart..."
          : success
            ? "✓ Added to cart!"
            : product.totalStock === 0
              ? "Out of stock"
              : "Add to Cart"}
      </button>

      {/* Stock Info */}
      <p className="text-xs text-gray-500">
        {product.totalStock > 0
          ? `${product.totalStock} in stock`
          : "Out of stock"}
      </p>
    </form>
  );
}
