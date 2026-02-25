"use client";

import { useState, useEffect } from "react";
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

const INITIAL_ADDRESS_FORM = {
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
};

const NavButton = ({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`block w-full text-left px-4 py-3 text-xs tracking-wider transition ${
      active
        ? "text-black border-l-2 border-l-black bg-gray-50"
        : "text-gray-600 hover:text-black"
    }`}
  >
    {label}
  </button>
);

const EmptyState = ({
  message,
  buttonText,
  onButtonClick,
}: {
  message: string;
  buttonText: string;
  onButtonClick: () => void;
}) => (
  <div className="text-center py-12">
    <p className="text-sm text-gray-600 mb-6">{message}</p>
    <button
      onClick={onButtonClick}
      className="text-xs text-black border border-gray-300 px-4 py-3 inline-block hover:bg-gray-50 transition tracking-wider"
    >
      {buttonText}
    </button>
  </div>
);

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
  const [addressForm, setAddressForm] = useState(INITIAL_ADDRESS_FORM);

  useEffect(() => {
    Promise.all([fetchUserData(), fetchOrders(), fetchAddresses()]).then(() => {
      setLoading(false);
      // Dispatch event to notify Header that data loading is complete
      window.dispatchEvent(new Event("dataLoadComplete"));
    });
  }, []);

  const resetAddressForm = () => setAddressForm(INITIAL_ADDRESS_FORM);

  async function fetchUserData() {
    try {
      setUser(await getUserInfo());
    } catch {
      const userId = localStorage.getItem("userId");
      setUser({
        id: userId || "user-1",
        name: "User",
        email: "user@example.com",
        phone: "",
      });
    }
  }

  async function fetchOrders() {
    try {
      setOrders(await getOrders());
    } catch {
      setOrders([]);
    }
  }

  async function fetchAddresses() {
    try {
      setAddresses(
        Array.isArray(await getAddresses()) ? await getAddresses() : [],
      );
    } catch {
      setAddresses([]);
    }
  }

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      ...INITIAL_ADDRESS_FORM,
      isDefault: addresses.length === 0,
    });
    setShowAddressModal(true);
  };

  const handleSaveAddress = (formData: typeof INITIAL_ADDRESS_FORM) => {
    const saveAddress = editingAddress
      ? () =>
          updateAddress(editingAddress.id, formData).then((updatedAddress) => {
            setAddresses(
              addresses.map((a) =>
                a.id === editingAddress.id ? updatedAddress : a,
              ),
            );
          })
      : () =>
          addAddress(formData).then((newAddress) => {
            setAddresses([...addresses, newAddress]);
          });

    saveAddress()
      .then(() => {
        setShowAddressModal(false);
        resetAddressForm();
        setEditingAddress(null);
      })
      .catch(() => alert("Lỗi khi lưu địa chỉ. Vui lòng thử lại."));
  };

  const handleSignOut = () => {
    clearAuth();
    router.push("/");
  };

  if (loading) return <Loading />;

  const activeOrders = orders.filter((o) => o.status !== "delivered");
  const defaultAddress = addresses.find((a) => a.isDefault);

  return (
    <div
      className="min-h-screen w-full bg-white flex pt-[10%] justify-center"
      data-nav-theme="light"
    >
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 lg:ml-[25%] lg:mr-[10%] mx-auto py-8">
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
              <NavButton
                active={activeTab === "account"}
                onClick={() => setActiveTab("account")}
                label="THÔNG TIN TÀI KHOẢN"
              />
              <NavButton
                active={activeTab === "orders"}
                onClick={() => setActiveTab("orders")}
                label="ĐƠN HÀNG"
              />
              <NavButton
                active={activeTab === "history"}
                onClick={() => setActiveTab("history")}
                label="LỊCH SỬ ĐẶT HÀNG"
              />
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xs tracking-widest text-black mb-6 uppercase font-medium">
                    THÔNG TIN TÀI KHOẢN
                  </h2>
                  {addresses.length === 0 ? (
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
                  ) : defaultAddress ? (
                    <div className="border border-gray-300 p-6">
                      <div className="space-y-1 text-sm text-black mb-4">
                        <p className="text-xs text-black tracking-wider mb-3 uppercase font-bold">
                          {defaultAddress.firstName} {defaultAddress.lastName}
                        </p>
                        <p>{defaultAddress.street}</p>
                        {defaultAddress.ward && <p>{defaultAddress.ward}</p>}
                        <p>
                          {defaultAddress.district}
                          {defaultAddress.city}
                        </p>
                        <p>{defaultAddress.postalCode}</p>
                        <p>{defaultAddress.country}</p>
                      </div>
                      <button
                        onClick={() => router.push("/addresses")}
                        className="text-xs text-black border border-gray-300 px-4 py-3 hover:bg-gray-50 transition tracking-wider w-full flex items-center justify-center gap-2"
                      >
                        <span>XEM ĐỊA CHỈ</span>
                        <span>ℹ️</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-xs tracking-widest text-black mb-6 uppercase font-medium">
                  ĐƠN HÀNG HIỆN TẠI
                </h2>

                {activeOrders.length === 0 ? (
                  <EmptyState
                    message="Không có đơn hàng nào đang xử lý"
                    buttonText="TIẾP TỤC MUA SẮM"
                    onButtonClick={() => router.push("/catalog")}
                  />
                ) : (
                  <div className="space-y-6">
                    {activeOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
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
                  <EmptyState
                    message="Chưa có đơn hàng nào"
                    buttonText="BẮT ĐẦU MUA SẮM"
                    onButtonClick={() => router.push("/catalog")}
                  />
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <OrderHistoryRow key={order.id} order={order} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Address Modal */}
        <AddressModal
          isOpen={showAddressModal}
          onClose={() => {
            setShowAddressModal(false);
            resetAddressForm();
            setEditingAddress(null);
          }}
          onSave={handleSaveAddress}
          editingAddress={editingAddress}
          initialForm={addressForm}
        />
      </div>
    </div>
  );
}

const OrderCard = ({ order }: { order: Order }) => (
  <div className="border border-gray-300 p-6">
    <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-300">
      <OrderDetailField
        label="ĐƠN HÀNG"
        value={`#${order.id.substring(0, 8).toUpperCase()}`}
      />
      <OrderDetailField
        label="NGÀY"
        value={new Date(order.createdAt).toLocaleDateString("vi-VN")}
      />
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
      <OrderDetailField
        label="TỔNG CỘNG"
        value={`${order.total.toLocaleString("vi-VN")} VND`}
        textAlign="right"
      />
    </div>
    <div className="space-y-2">
      {order.items.map((item, idx) => (
        <div key={idx} className="flex justify-between text-sm">
          <span className="text-gray-700">
            {item.name} × {item.quantity}
          </span>
          <span className="text-black">
            {(item.price * item.quantity).toLocaleString("vi-VN")} VND
          </span>
        </div>
      ))}
    </div>
  </div>
);

const OrderDetailField = ({
  label,
  value,
  textAlign = "left",
}: {
  label: string;
  value: string;
  textAlign?: "left" | "right";
}) => (
  <div className={textAlign === "right" ? "text-right" : ""}>
    <p className="text-xs text-gray-600 tracking-wider mb-1 uppercase">
      {label}
    </p>
    <p className="text-sm text-black font-medium">{value}</p>
  </div>
);

const OrderHistoryRow = ({ order }: { order: Order }) => (
  <div className="border border-gray-300 p-4 hover:bg-gray-50 transition cursor-pointer">
    <div className="flex justify-between items-center">
      <div className="flex-1">
        <p className="text-sm font-medium text-black">
          #{order.id.substring(0, 8).toUpperCase()}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          {new Date(order.createdAt).toLocaleDateString("vi-VN")} •{" "}
          {order.items.length} sản phẩm
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
);
