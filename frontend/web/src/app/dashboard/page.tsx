"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAuthenticated, clearAuth, getUserId } from "@/lib/api";

interface Order {
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
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/signin");
      return;
    }

    fetchUserData();
    fetchOrders();
  }, []);

  async function fetchUserData() {
    try {
      const userId = localStorage.getItem("userId");
      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: {
          "X-User-Id": userId || "",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }

  async function fetchOrders() {
    try {
      const userId = localStorage.getItem("userId");
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: {
          "X-User-Id": userId || "",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSignOut() {
    clearAuth();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              The New Originals
            </Link>
            <nav className="space-x-6">
              <Link href="/catalog" className="hover:underline">
                Shop
              </Link>
              <Link href="/cart" className="hover:underline">
                Cart
              </Link>
              <button onClick={handleSignOut} className="hover:underline">
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-6">Profile Information</h2>

              {user && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Name
                    </label>
                    <p className="text-lg">{user.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Email
                    </label>
                    <p className="text-lg">{user.email}</p>
                  </div>

                  {user.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Phone
                      </label>
                      <p className="text-lg">{user.phone}</p>
                    </div>
                  )}
                </div>
              )}

              <button className="mt-6 w-full border border-gray-300 py-2 rounded hover:bg-gray-50 transition">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-6">Order History</h2>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">No orders yet</p>
                  <Link
                    href="/catalog"
                    className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Order #{order.id.substring(0, 8)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "processing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.name} × {item.quantity}
                            </span>
                            <span>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4 flex justify-between font-bold">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>

                      <div className="mt-4 text-sm text-gray-600">
                        <p className="font-medium mb-1">Shipping Address:</p>
                        <p>{order.shippingAddress.street}</p>
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.postalCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
