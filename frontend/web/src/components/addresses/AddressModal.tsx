"use client";

import { useState, useEffect } from "react";

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

interface AddressFormData {
  firstName: string;
  lastName: string;
  company: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (addressForm: AddressFormData) => void;
  editingAddress: Address | null;
  initialForm: AddressFormData;
}

export default function AddressModal({
  isOpen,
  onClose,
  onSave,
  editingAddress,
  initialForm,
}: AddressModalProps) {
  const [addressForm, setAddressForm] = useState<AddressFormData>(initialForm);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setAddressForm(initialForm);
    setErrors([]);
  }, [initialForm, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const missingFields: string[] = [];

    if (!addressForm.firstName?.trim()) {
      missingFields.push("Họ");
    }
    if (!addressForm.lastName?.trim()) {
      missingFields.push("Tên");
    }
    if (!addressForm.street?.trim()) {
      missingFields.push("Địa chỉ 1");
    }
    if (!addressForm.ward?.trim()) {
      missingFields.push("Phường (Xã)");
    }
    if (!addressForm.district?.trim()) {
      missingFields.push("Quận (Huyện)");
    }
    if (!addressForm.city?.trim()) {
      missingFields.push("Tỉnh (Thành)");
    }
    if (!addressForm.country || addressForm.country === "---") {
      missingFields.push("Quốc gia/Lãnh thổ");
    }
    if (!addressForm.postalCode?.trim()) {
      missingFields.push("Mã bưu chính");
    }
    if (!addressForm.phone?.trim()) {
      missingFields.push("Điện thoại");
    }

    if (missingFields.length > 0) {
      setErrors(missingFields);
      return;
    }

    setErrors([]);
    onSave(addressForm);
    setAddressForm(initialForm);
  };

  const handleClose = () => {
    setAddressForm(initialForm);
    setErrors([]);
    onClose();
  };

  const clearErrors = () => {
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const getErrorClass = (fieldName: string) => {
    return errors.includes(fieldName)
      ? "border-red-500 focus:border-red-500"
      : "border-gray-300 focus:border-black";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-medium text-black uppercase tracking-wider">
            {editingAddress ? "CHỈNH SỬA ĐỊA CHỈ" : "THÊM MỘT ĐỊA CHỈ MỚI"}
          </h2>
          <button
            onClick={handleClose}
            className="text-xl text-gray-600 hover:text-black transition"
          >
            ✕
          </button>
        </div>

        {/* Error Display */}

        <div className="space-y-4 mb-8">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 tracking-wider mb-2 uppercase">
                HỌ
              </label>
              <input
                type="text"
                value={addressForm.firstName}
                onChange={(e) => {
                  setErrors([]);
                  setAddressForm({
                    ...addressForm,
                    firstName: e.target.value,
                  });
                }}
                className={`w-full border px-4 py-3 text-sm !text-black placeholder-gray-500 focus:outline-none ${
                  errors.includes("Họ")
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-black"
                }`}
                placeholder="Họ"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 tracking-wider mb-2 uppercase">
                TÊN *
              </label>
              <input
                type="text"
                value={addressForm.lastName}
                onChange={(e) => {
                  clearErrors();
                  setAddressForm({
                    ...addressForm,
                    lastName: e.target.value,
                  });
                }}
                className={`w-full border px-4 py-3 text-sm !text-black placeholder-gray-500 focus:outline-none ${
                  errors.includes("Tên")
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-black"
                }`}
                placeholder="Tên"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs text-gray-600 tracking-wider mb-2 uppercase">
              CÔNG TY
            </label>
            <input
              type="text"
              value={addressForm.company}
              onChange={(e) => {
                clearErrors();
                setAddressForm({
                  ...addressForm,
                  company: e.target.value,
                });
              }}
              className="w-full border border-gray-300 px-4 py-3 text-sm !text-black placeholder-gray-500 focus:outline-none focus:border-black"
              placeholder="Công ty (tùy chọn)"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs text-gray-600 tracking-wider mb-2 uppercase">
              ĐỊA CHỈ 1 *
            </label>
            <input
              type="text"
              value={addressForm.street}
              onChange={(e) => {
                clearErrors();
                setAddressForm({
                  ...addressForm,
                  street: e.target.value,
                });
              }}
              className={`w-full border px-4 py-3 text-sm !text-black placeholder-gray-500 focus:outline-none ${getErrorClass(
                "Địa chỉ 1",
              )}`}
              placeholder="Số nhà, đường phố"
            />
          </div>

          {/* Ward */}
          <div>
            <label className="block text-xs text-gray-600 tracking-wider mb-2 uppercase">
              PHƯỜNG (XÃ) *
            </label>
            <input
              type="text"
              value={addressForm.ward}
              onChange={(e) => {
                clearErrors();
                setAddressForm({
                  ...addressForm,
                  ward: e.target.value,
                });
              }}
              className={`w-full border px-4 py-3 text-sm !text-black placeholder-gray-500 focus:outline-none ${getErrorClass(
                "Phường (Xã)",
              )}`}
              placeholder="Phường / Xã"
            />
          </div>

          {/* District */}
          <div>
            <label className="block text-xs text-gray-600 tracking-wider mb-2 uppercase">
              QUẬN (HUYỆN) *
            </label>
            <input
              type="text"
              value={addressForm.district}
              onChange={(e) => {
                clearErrors();
                setAddressForm({
                  ...addressForm,
                  district: e.target.value,
                });
              }}
              className={`w-full border px-4 py-3 text-sm !text-black placeholder-gray-500 focus:outline-none ${getErrorClass(
                "Quận (Huyện)",
              )}`}
              placeholder="Quận / Huyện"
            />
            <label className="block text-xs text-gray-600 tracking-wider mb-2 uppercase">
              TỈNH (THÀNH) *
            </label>
            <input
              type="text"
              value={addressForm.city}
              onChange={(e) => {
                clearErrors();
                setAddressForm({
                  ...addressForm,
                  city: e.target.value,
                });
              }}
              className={`w-full border px-4 py-3 text-sm !text-black placeholder-gray-500 focus:outline-none ${getErrorClass(
                "Tỉnh (Thành)",
              )}`}
              placeholder="Thành phố / Tỉnh"
            />
          </div>

          {/* Country Dropdown */}
          <div>
            <label className="block text-xs text-gray-600 tracking-wider mb-2 uppercase">
              QUỐC GIA/LÃNH THỔ *
            </label>
            <select
              value={addressForm.country}
              onChange={(e) => {
                clearErrors();
                setAddressForm({
                  ...addressForm,
                  country: e.target.value,
                });
              }}
              className={`w-full border px-4 py-3 text-sm !text-black focus:outline-none bg-white ${getErrorClass(
                "Quốc gia/Lãnh thổ",
              )}`}
            >
              <option value="---">---</option>
              <option value="VIỆT NAM">VIỆT NAM</option>
              <option value="THÁI LAN">THÁI LAN</option>
              <option value="SINGAPORE">SINGAPORE</option>
              <option value="MALAYSIA">MALAYSIA</option>
              <option value="INDONESIA">INDONESIA</option>
              <option value="PHILIPPINES">PHILIPPINES</option>
            </select>
          </div>

          {/* Postal Code and Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 tracking-wider mb-2 uppercase">
                MÃ BƯU CHÍNH *
              </label>
              <input
                type="text"
                value={addressForm.postalCode}
                onChange={(e) => {
                  clearErrors();
                  setAddressForm({
                    ...addressForm,
                    postalCode: e.target.value,
                  });
                }}
                className={`w-full border px-4 py-3 text-sm !text-black placeholder-gray-500 focus:outline-none ${getErrorClass(
                  "Mã bưu chính",
                )}`}
                placeholder="Mã bưu chính"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 tracking-wider mb-2 uppercase">
                ĐIỆN THOẠI *
              </label>
              <input
                type="text"
                value={addressForm.phone}
                onChange={(e) => {
                  const phoneValue = e.target.value.replace(/[^0-9]/g, "");
                  clearErrors();
                  setAddressForm({
                    ...addressForm,
                    phone: phoneValue,
                  });
                }}
                className={`w-full border px-4 py-3 text-sm !text-black placeholder-gray-500 focus:outline-none ${getErrorClass(
                  "Điện thoại",
                )}`}
                placeholder="Số điện thoại"
              />
            </div>
          </div>

          {/* Default Address Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="default-address"
              checked={addressForm.isDefault}
              onChange={(e) => {
                clearErrors();
                setAddressForm({
                  ...addressForm,
                  isDefault: e.target.checked,
                });
              }}
              className="w-4 h-4 border border-gray-300 cursor-pointer"
            />
            <label
              htmlFor="default-address"
              className="text-xs text-gray-600 tracking-wider uppercase cursor-pointer"
            >
              ĐẶT LÀM ĐỊA CHỈ MẶC ĐỊNH
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 text-xs text-black border border-gray-300 px-4 py-3 hover:bg-gray-50 transition tracking-wider font-medium"
          >
            HUỶ BỎ
          </button>
          <button
            onClick={handleSave}
            className="flex-1 text-xs text-white bg-black px-4 py-3 hover:bg-gray-900 transition tracking-wider font-medium"
          >
            {editingAddress ? "CẬP NHẬT" : "THÊM"}
          </button>
        </div>
      </div>
    </div>
  );
}
