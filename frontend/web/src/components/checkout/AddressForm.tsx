import { ChevronDown } from "lucide-react";
import { inp, sel, PROVINCES } from "./checkoutConstants";

export interface AddressFormValues {
  firstName: string;
  lastName: string;
  address: string;
  ward: string;
  district: string;
  province: string;
  postalCode: string;
  phone: string;
}

interface AddressFormProps {
  values: AddressFormValues;
  onChange: (field: string, value: string) => void;
  /** Whether all fields are required (shipping) or optional phone (billing) */
  required?: boolean;
}

export function AddressForm({
  values,
  onChange,
  required = true,
}: AddressFormProps) {
  return (
    <>
      {/* Country */}
      <div className="relative mb-3">
        <select value="VN" disabled className={sel}>
          <option value="VN">Việt Nam</option>
        </select>
        <label className="absolute left-3 top-1.5 text-[10px] text-gray-400 uppercase tracking-widest pointer-events-none">
          Quốc gia/Vùng
        </label>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>

      {/* Last + First */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="relative">
          <input
            type="text"
            required={required}
            value={values.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder=" "
            className={inp}
          />
          <label className="absolute left-3 top-1.5 text-[10px] text-gray-400 uppercase tracking-widest pointer-events-none">
            Họ
          </label>
        </div>
        <div className="relative">
          <input
            type="text"
            required={required}
            value={values.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder=" "
            className={inp}
          />
          <label className="absolute left-3 top-1.5 text-[10px] text-gray-400 uppercase tracking-widest pointer-events-none">
            Tên
          </label>
        </div>
      </div>

      {/* Street */}
      <div className="relative mb-3">
        <input
          type="text"
          required={required}
          value={values.address}
          onChange={(e) => onChange("address", e.target.value)}
          placeholder=" "
          className={inp}
        />
        <label className="absolute left-3 top-1.5 text-[10px] text-gray-400 uppercase tracking-widest pointer-events-none">
          Địa chỉ
        </label>
      </div>

      {/* Ward */}
      <div className="relative mb-3">
        <input
          type="text"
          value={values.ward}
          onChange={(e) => onChange("ward", e.target.value)}
          placeholder=" "
          className={inp}
        />
        <label className="absolute left-3 top-1.5 text-[10px] text-gray-400 uppercase tracking-widest pointer-events-none">
          Phường (xã)
        </label>
      </div>

      {/* District + Province */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="relative">
          <input
            type="text"
            value={values.district}
            onChange={(e) => onChange("district", e.target.value)}
            placeholder=" "
            className={inp}
          />
          <label className="absolute left-3 top-1.5 text-[10px] text-gray-400 uppercase tracking-widest pointer-events-none">
            Quận (huyện)
          </label>
        </div>
        <div className="relative">
          <select
            required={required}
            value={values.province}
            onChange={(e) => onChange("province", e.target.value)}
            className={sel}
          >
            <option value=""></option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <label className="absolute left-3 top-1.5 text-[10px] text-gray-400 uppercase tracking-widest pointer-events-none">
            Tỉnh (thành)
          </label>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Phone */}
      <div className="relative">
        <input
          type="tel"
          required={required}
          value={values.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder=" "
          className={`${inp} pr-16`}
        />
        <label className="absolute left-3 top-1.5 text-[10px] text-gray-400 uppercase tracking-widest pointer-events-none">
          {required ? "Điện thoại" : "Điện thoại (không bắt buộc)"}
        </label>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <span className="text-base">🇻🇳</span>
          <ChevronDown size={12} className="text-gray-400" />
        </div>
      </div>
    </>
  );
}
