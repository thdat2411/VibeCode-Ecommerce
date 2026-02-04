"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearAuth } from "@/lib/api/auth";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/api/addresses";
import AddressModal from "@/components/AddressModal";
import Toast from "@/components/Toast";

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

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [expandedAddressId, setExpandedAddressId] = useState<string | null>(
    null,
  );
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
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
    fetchAddresses();
  }, []);

  async function fetchAddresses() {
    try {
      const data = await getAddresses();
      setAddresses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setAddresses([]);
    } finally {
      setLoading(false);
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
      country: address.country,
      postalCode: address.postalCode,
      phone: address.phone,
      isDefault: address.isDefault || false,
    });
    setShowAddressModal(true);
  }

  async function handleDeleteAddress(addressId: string) {
    try {
      await deleteAddress(addressId);
      setAddresses(addresses.filter((a) => a.id !== addressId));
      setToast({ message: "Đã xóa địa chỉ thành công", type: "success" });
    } catch (error) {
      console.error("Error deleting address:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Lỗi khi xóa địa chỉ. Vui lòng thử lại.";
      setToast({ message: errorMessage, type: "error" });
    }
  }

  async function handleSetDefaultAddress(addressId: string) {
    try {
      await setDefaultAddress(addressId);
      // Update all addresses: set the new one as default, unset others
      setAddresses(
        addresses.map((a) => ({
          ...a,
          isDefault: a.id === addressId,
        })),
      );
      // Close the expanded view after setting default
      setExpandedAddressId(null);
      setToast({ message: "Đã đặt làm địa chỉ mặc định", type: "success" });
    } catch (error) {
      console.error("Error setting default address:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Lỗi khi đặt địa chỉ mặc định. Vui lòng thử lại.";
      setToast({ message: errorMessage, type: "error" });
    }
  }

  return (
    <div className="min-h-screen bg-white flex pt-[10%]">
      {/* Header */}

      {/* Content */}
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 md:ml-[25%] md:mr-[10%] mx-auto py-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-black transition"
          >
            ←
          </Link>
          <h1 className="text-sm tracking-widest text-black uppercase font-medium">
            QUAY LẠI THÔNG TIN TÀI KHOẢN
          </h1>
        </div>
        {addresses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-600 mb-6">Chưa có địa chỉ nào</p>
            <button
              onClick={handleAddAddress}
              className="text-xs text-white bg-black px-6 py-3 hover:bg-gray-900 transition tracking-wider"
            >
              THÊM ĐỊA CHỈ ĐẦU TIÊN
            </button>
          </div>
        ) : (
          <>
            {/* Default Address */}
            {addresses.find((a) => a.isDefault) && (
              <div className="mb-8">
                {(() => {
                  const defaultAddr = addresses.find((a) => a.isDefault);
                  return (
                    <div className="border border-gray-300 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <p className="font-medium text-black">
                          {defaultAddr?.firstName} {defaultAddr?.lastName}
                        </p>
                        <span className="bg-black text-white text-xs px-2 py-1 uppercase tracking-wider">
                          MẶC ĐỊNH
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-700 mb-4">
                        {defaultAddr?.company && (
                          <p>
                            <span className="font-medium">Công ty:</span>{" "}
                            {defaultAddr.company}
                          </p>
                        )}
                        <p>
                          <span className="font-medium">Địa chỉ:</span>{" "}
                          {defaultAddr?.street}
                        </p>
                        {defaultAddr?.ward && (
                          <p>
                            <span className="font-medium">Phường/Xã:</span>{" "}
                            {defaultAddr.ward}
                          </p>
                        )}
                        <p>
                          <span className="font-medium">Tỉnh/TP:</span>{" "}
                          {defaultAddr?.city}
                        </p>
                        <p>
                          <span className="font-medium">Mã bưu điện:</span>{" "}
                          {defaultAddr?.postalCode}
                        </p>
                        <p>
                          <span className="font-medium">Quốc gia:</span>{" "}
                          {defaultAddr?.country}
                        </p>
                      </div>
                      <div className="flex gap-3 text-xs pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleEditAddress(defaultAddr!)}
                          className="text-gray-600 hover:text-black transition"
                        >
                          SỬA
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(defaultAddr!.id)}
                          className="text-gray-600 hover:text-red-600 transition"
                        >
                          XÓA
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Other Addresses */}
            {addresses.filter((a) => !a.isDefault).length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-xs text-black tracking-wider uppercase font-medium">
                    ĐỊA CHỈ KHÁC
                  </p>
                  <span className="text-xs text-gray-600 font-medium">
                    ({addresses.filter((a) => !a.isDefault).length})
                  </span>
                </div>
                <div className="space-y-3">
                  {addresses
                    .filter((a) => !a.isDefault)
                    .map((address) => (
                      <div key={address.id}>
                        {/* Compact View */}
                        <div className="border border-gray-300 p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <p className="font-medium text-black">
                                {address.firstName} {address.lastName}{" "}
                                <span className="text-sm text-gray-600">
                                  • {address.phone}
                                </span>
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                setExpandedAddressId(
                                  expandedAddressId === address.id
                                    ? null
                                    : address.id,
                                )
                              }
                              className="ml-4 flex-shrink-0 text-gray-600 hover:text-black transition"
                            >
                              <span
                                className={`text-lg inline-block transition-transform duration-300 ${
                                  expandedAddressId === address.id
                                    ? "rotate-180"
                                    : "rotate-0"
                                }`}
                              >
                                ▼
                              </span>
                            </button>
                          </div>

                          {/* Expanded View */}
                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              expandedAddressId === address.id
                                ? "max-h-96 opacity-100"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="mt-4 pt-4 border-t border-gray-200 space-y-1 text-sm text-gray-700">
                              {address.company && (
                                <p>
                                  <span className="font-medium">Công ty:</span>{" "}
                                  {address.company}
                                </p>
                              )}
                              <p>
                                <span className="font-medium">Địa chỉ:</span>{" "}
                                {address.street}
                              </p>
                              {address.ward && (
                                <p>
                                  <span className="font-medium">
                                    Phường/Xã:
                                  </span>{" "}
                                  {address.ward}
                                </p>
                              )}
                              <p>
                                <span className="font-medium">Tỉnh/TP:</span>{" "}
                                {address.city}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Mã bưu điện:
                                </span>{" "}
                                {address.postalCode}
                              </p>
                              <p>
                                <span className="font-medium">Quốc gia:</span>{" "}
                                {address.country}
                              </p>

                              {/* Action Buttons */}
                              <div className="mt-4 flex gap-3 text-xs pt-4 border-t border-gray-200">
                                <button
                                  onClick={() =>
                                    handleSetDefaultAddress(address.id)
                                  }
                                  className="text-gray-600 hover:text-black transition"
                                >
                                  ĐẶT MẶC ĐỊNH
                                </button>
                                <button
                                  onClick={() => handleEditAddress(address)}
                                  className="text-gray-600 hover:text-black transition"
                                >
                                  SỬA
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteAddress(address.id)
                                  }
                                  className="text-gray-600 hover:text-red-600 transition"
                                >
                                  XÓA
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Add New Address Button */}
            <button
              onClick={handleAddAddress}
              className="mt-8 text-xs text-white bg-black px-6 py-3 hover:bg-gray-900 transition tracking-wider"
            >
              THÊM MỘT ĐỊA CHỈ MỚI
            </button>
          </>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
        onSave={async (formData) => {
          if (editingAddress) {
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
                setToast({
                  message: "Đã cập nhật địa chỉ thành công",
                  type: "success",
                });
              })
              .catch((error) => {
                console.error("Error updating address:", error);
                const errorMessage =
                  error instanceof Error
                    ? error.message
                    : "Lỗi khi cập nhật địa chỉ. Vui lòng thử lại.";
                setToast({ message: errorMessage, type: "error" });
              });
          } else {
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
                setToast({
                  message: "Đã thêm địa chỉ mới thành công",
                  type: "success",
                });
              })
              .catch((error) => {
                console.error("Error adding address:", error);
                const errorMessage =
                  error instanceof Error
                    ? error.message
                    : "Lỗi khi thêm địa chỉ. Vui lòng thử lại.";
                setToast({ message: errorMessage, type: "error" });
              });
          }
        }}
        editingAddress={editingAddress}
        initialForm={addressForm}
      />
    </div>
  );
}
