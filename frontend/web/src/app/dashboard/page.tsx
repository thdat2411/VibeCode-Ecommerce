"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearAuth } from "@/lib/api/auth";
import { getOrders, getUserInfo } from "@/lib/api/orders";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/api/addresses";
import Loading from "@/app/loading";
import AddressModal from "@/components/AddressModal";

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

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  ward?: string;
  district: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"account" | "orders" | "history">(
    "account",
  );
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    street: "",
    ward: "",
    district: "",
    city: "",
    country: "---",
    postalCode: "",
    phone: "",
    isDefault: false,
  });

  useEffect(() => {
    fetchUserData();
    fetchOrders();
    fetchAddresses();

    // Set a timeout to exit loading state after 5 seconds
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  async function fetchUserData() {
    try {
      const data = await getUserInfo();
      setUser(data);
    } catch (error) {
      const userId = localStorage.getItem("userId");
      setUser({
        id: userId || "user-1",
        name: "Nguyễn Văn A",
        email: localStorage.getItem("userEmail") || "user@example.com",
        phone: "0123456789",
      });
    }
  }

  async function fetchOrders() {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAddresses() {
    try {
      const data = await getAddresses();
      setAddresses(Array.isArray(data) ? data : []);
    } catch (error) {
      setAddresses([]);
    }
  }

  function handleAddAddress() {
    setEditingAddress(null);
    setAddressForm({
      firstName: "",
      lastName: "",
      company: "",
      street: "",
      ward: "",
      district: "",
      city: "",
      country: "---",
      postalCode: "",
      phone: "",
      isDefault: addresses.length === 0,
    });
    setShowAddressModal(true);
  }

  function handleEditAddress(address: Address) {
    setEditingAddress(address);
    setAddressForm({
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company || "",
      street: address.street,
      ward: address.ward || "",
      district: address.district,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault || false,
    });
    setShowAddressModal(true);
  }

  function handleDeleteAddress(addressId: string) {
    deleteAddress(addressId)
      .then(() => {
        setAddresses(addresses.filter((a) => a.id !== addressId));
      })
      .catch((error) => {
        alert("Lỗi khi xóa địa chỉ. Vui lòng thử lại.");
      });
  }

  function handleSetDefaultAddress(addressId: string) {
    setDefaultAddress(addressId)
      .then(() => {
        setAddresses(
          addresses.map((a) => ({
            ...a,
            isDefault: a.id === addressId,
          })),
        );
      })
      .catch((error) => {
        alert("Lỗi khi đặt địa chỉ mặc định. Vui lòng thử lại.");
      });
  }

  function handleSignOut() {
    clearAuth();
    router.push("/");
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      className="min-h-screen w-full bg-white flex pt-[10%] justify-center"
      data-nav-theme="light"
    >
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 md:ml-[25%] md:mr-[10%] mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl text-black font-light tracking-wide">
              TÀI KHOẢN
            </h1>
            <p className="text-xs text-gray-500 tracking-widest mt-1 uppercase">
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-xs text-black border border-gray-300 px-4 py-2 hover:bg-gray-50 transition tracking-wider"
          >
            ĐĂNG XUẤT
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="space-y-1 border-l border-gray-300">
              <button
                onClick={() => setActiveTab("account")}
                className={`block w-full text-left px-4 py-3 text-xs tracking-wider transition ${
                  activeTab === "account"
                    ? "text-black border-l-2 border-l-black bg-gray-50"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                THÔNG TIN TÀI KHOẢN
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`block w-full text-left px-4 py-3 text-xs tracking-wider transition ${
                  activeTab === "orders"
                    ? "text-black border-l-2 border-l-black bg-gray-50"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                ĐƠN HÀNG
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`block w-full text-left px-4 py-3 text-xs tracking-wider transition ${
                  activeTab === "history"
                    ? "text-black border-l-2 border-l-black bg-gray-50"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                LỊCH SỬ ĐẶT HÀNG
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="space-y-8">
                {/* User Info Section */}

                {/* Default Address Section */}
                <div>
                  <h2 className="text-xs tracking-widest text-black mb-6 uppercase font-medium">
                    THÔNG TIN TÀI KHOẢN
                  </h2>
                  {!Array.isArray(addresses) || addresses.length === 0 ? (
                    <div className="border border-gray-300 p-6">
                      <p className="text-sm text-gray-600 mb-4">
                        Chưa có địa chỉ nào được thiết lập
                      </p>
                      <button
                        onClick={handleAddAddress}
                        className="text-xs text-black border border-gray-300 px-4 py-3 hover:bg-gray-50 transition tracking-wider w-full"
                      >
                        THÊM ĐỊA CHỈ
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Show Default Address Only */}
                      {Array.isArray(addresses) &&
                        addresses.find((a) => a.isDefault) && (
                          <div className="border border-gray-300 p-6">
                            {(() => {
                              const defaultAddr = addresses.find(
                                (a) => a.isDefault,
                              );
                              return (
                                <div>
                                  <div className="space-y-1 text-sm text-black mb-4">
                                    <p className="text-xs text-black tracking-wider mb-3 uppercase font-bold">
                                      {defaultAddr?.firstName}{" "}
                                      {defaultAddr?.lastName}
                                    </p>
                                    <p>{defaultAddr?.street}</p>
                                    {defaultAddr?.ward && (
                                      <p>{defaultAddr.ward}</p>
                                    )}
                                    <p>
                                      {defaultAddr?.district}
                                      {defaultAddr?.city}
                                    </p>
                                    <p>{defaultAddr?.postalCode}</p>
                                    <p>{defaultAddr?.country}</p>
                                  </div>
                                  <button
                                    onClick={() => router.push("/addresses")}
                                    className="text-xs text-black border border-gray-300 px-4 py-3 hover:bg-gray-50 transition tracking-wider w-full flex items-center justify-center gap-2"
                                  >
                                    <span>XEM ĐỊA CHỈ</span>
                                    <span>ℹ️</span>
                                  </button>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-xs tracking-widest text-black mb-6 uppercase font-medium">
                  ĐƠN HÀNG HIỆN TẠI
                </h2>

                {orders.filter((o) => o.status !== "delivered").length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-gray-600 mb-6">
                      Không có đơn hàng nào đang xử lý
                    </p>
                    <Link
                      href="/catalog"
                      className="text-xs text-black border border-gray-300 px-4 py-3 inline-block hover:bg-gray-50 transition tracking-wider"
                    >
                      TIẾP TỤC MUA SẮM
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders
                      .filter((o) => o.status !== "delivered")
                      .map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-300 p-6"
                        >
                          <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-300">
                            <div>
                              <p className="text-xs text-gray-600 tracking-wider mb-1 uppercase">
                                ĐƠN HÀNG
                              </p>
                              <p className="text-sm text-black font-medium">
                                #{order.id.substring(0, 8).toUpperCase()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 tracking-wider mb-1 uppercase">
                                NGÀY
                              </p>
                              <p className="text-sm text-black">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 tracking-wider mb-1 uppercase">
                                TRẠNG THÁI
                              </p>
                              <p
                                className={`text-sm font-medium ${
                                  order.status === "processing"
                                    ? "text-yellow-600"
                                    : order.status === "shipped"
                                      ? "text-blue-600"
                                      : "text-gray-600"
                                }`}
                              >
                                {order.status === "processing"
                                  ? "ĐANG XỬ LÝ"
                                  : order.status === "shipped"
                                    ? "ĐÃ GIAO"
                                    : order.status}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-600 tracking-wider mb-1 uppercase">
                                TỔNG CỘNG
                              </p>
                              <p className="text-sm text-black font-medium">
                                {order.total.toLocaleString("vi-VN")} VND
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-gray-700">
                                  {item.name} × {item.quantity}
                                </span>
                                <span className="text-black">
                                  {(item.price * item.quantity).toLocaleString(
                                    "vi-VN",
                                  )}{" "}
                                  VND
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div>
                <h2 className="text-xs tracking-widest text-black mb-6 uppercase font-medium">
                  LỊCH SỬ ĐẶT HÀNG
                </h2>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-gray-600 mb-6">
                      Chưa có đơn hàng nào
                    </p>
                    <Link
                      href="/catalog"
                      className="text-xs text-black border border-gray-300 px-4 py-3 inline-block hover:bg-gray-50 transition tracking-wider"
                    >
                      BẮT ĐẦU MUA SẮM
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-300 p-4 hover:bg-gray-50 transition cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-black">
                              #{order.id.substring(0, 8).toUpperCase()}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {new Date(order.createdAt).toLocaleDateString(
                                "vi-VN",
                              )}{" "}
                              • {order.items.length} sản phẩm
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-black">
                              {order.total.toLocaleString("vi-VN")} VND
                            </p>
                            <p
                              className={`text-xs mt-1 font-medium ${
                                order.status === "delivered"
                                  ? "text-green-600"
                                  : order.status === "shipped"
                                    ? "text-blue-600"
                                    : "text-gray-600"
                              }`}
                            >
                              {order.status === "delivered"
                                ? "ĐÃ NHẬN"
                                : order.status === "shipped"
                                  ? "ĐÃ GIAO"
                                  : "ĐANG XỬ LÝ"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Address Modal Component */}
        <AddressModal
          isOpen={showAddressModal}
          onClose={() => {
            setShowAddressModal(false);
            setAddressForm({
              firstName: "",
              lastName: "",
              company: "",
              street: "",
              ward: "",
              district: "",
              city: "",
              country: "---",
              postalCode: "",
              phone: "",
              isDefault: false,
            });
            setEditingAddress(null);
          }}
          onSave={(formData) => {
            if (editingAddress) {
              // Update address via API
              updateAddress(editingAddress.id, formData)
                .then((updatedAddress) => {
                  setAddresses(
                    addresses.map((a) =>
                      a.id === editingAddress.id ? updatedAddress : a,
                    ),
                  );
                  setShowAddressModal(false);
                  setAddressForm({
                    firstName: "",
                    lastName: "",
                    company: "",
                    street: "",
                    ward: "",
                    district: "",
                    city: "",
                    country: "---",
                    postalCode: "",
                    phone: "",
                    isDefault: false,
                  });
                  setEditingAddress(null);
                })
                .catch((error) => {
                  alert("Lỗi khi cập nhật địa chỉ. Vui lòng thử lại.");
                });
            } else {
              // Add new address via API
              addAddress(formData)
                .then((newAddress) => {
                  setAddresses([...addresses, newAddress]);
                  setShowAddressModal(false);
                  setAddressForm({
                    firstName: "",
                    lastName: "",
                    company: "",
                    street: "",
                    ward: "",
                    district: "",
                    city: "",
                    country: "---",
                    postalCode: "",
                    phone: "",
                    isDefault: false,
                  });
                  setEditingAddress(null);
                })
                .catch((error) => {
                  alert("Lỗi khi thêm địa chỉ. Vui lòng thử lại.");
                });
            }
          }}
          editingAddress={editingAddress}
          initialForm={addressForm}
        />
      </div>
    </div>
  );
}
