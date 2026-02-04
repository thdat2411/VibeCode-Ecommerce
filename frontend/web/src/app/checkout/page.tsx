"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCart } from "@/lib/api/cart";
import { createOrder } from "@/lib/api/orders";
import { processCheckout } from "@/lib/api/payments";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const data = await getCart();
      setCart(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);

    try {
      // Create order first
      const orderData = {
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total,
        status: "pending",
        shippingAddress,
      };

      const order = await createOrder(orderData);

      // Create Stripe checkout session
      const checkoutData = {
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress,
      };

      const paymentResponse = await processCheckout(checkoutData);

      // Redirect to Stripe checkout
      if (paymentResponse.clientSecret) {
        // Handle redirect or payment processing
        alert("Payment processing - redirecting to checkout");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to process checkout. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  function updateAddress(field: string, value: string) {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Your cart is empty</p>
          <Link href="/catalog" className="text-blue-600 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold">
            The New Originals
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <form onSubmit={handleCheckout} className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-6">Shipping Address</h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="street"
                    className="block text-sm font-medium mb-2"
                  >
                    Street Address
                  </label>
                  <input
                    id="street"
                    type="text"
                    required
                    value={shippingAddress.street}
                    onChange={(e) => updateAddress("street", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="123 Main St"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium mb-2"
                    >
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => updateAddress("city", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="New York"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium mb-2"
                    >
                      State
                    </label>
                    <input
                      id="state"
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => updateAddress("state", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="NY"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium mb-2"
                    >
                      Postal Code
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      required
                      value={shippingAddress.postalCode}
                      onChange={(e) =>
                        updateAddress("postalCode", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="10001"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium mb-2"
                    >
                      Country
                    </label>
                    <input
                      id="country"
                      type="text"
                      required
                      value={shippingAddress.country}
                      onChange={(e) => updateAddress("country", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="US"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-black text-white py-4 rounded hover:bg-gray-800 transition font-semibold disabled:bg-gray-400"
            >
              {processing ? "Processing..." : "Proceed to Payment"}
            </button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-8">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>$10.00</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(total + 10).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
