"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCart, removeFromCart, getUserId } from "@/lib/api";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartResponse {
  items: CartItem[];
  total: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const userId = getUserId();
      if (!userId) return;

      const data = await getCart();
      setCart(data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(productId: string) {
    try {
      await removeFromCart(productId);
      fetchCart();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              The New Originals
            </Link>
            <nav className="space-x-6">
              <Link href="/catalog" className="hover:underline">
                Shop
              </Link>
              <Link href="/cart" className="hover:underline font-semibold">
                Cart
              </Link>
              <Link href="/auth/signin" className="hover:underline">
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        {isEmpty ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
            <Link
              href="/catalog"
              className="inline-block bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex gap-6 border-b pb-6">
                  <div className="w-32 h-32 relative bg-gray-100 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-4">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded">
                        <button className="px-3 py-1 hover:bg-gray-100">
                          −
                        </button>
                        <span className="px-4 py-1 border-x">
                          {item.quantity}
                        </span>
                        <button className="px-3 py-1 hover:bg-gray-100">
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 sticky top-8">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-black text-white text-center py-3 rounded hover:bg-gray-800 transition font-semibold"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/catalog"
                  className="block text-center mt-4 text-sm hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500">
          <p>&copy; 2026 The New Originals. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
