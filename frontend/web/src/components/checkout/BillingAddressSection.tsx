import { AddressForm, AddressFormValues } from "./AddressForm";

interface BillingAddressSectionProps {
  billingType: "same" | "different";
  billing: AddressFormValues;
  onBillingTypeChange: (type: "same" | "different") => void;
  onBillingChange: (field: string, value: string) => void;
}

export function BillingAddressSection({
  billingType,
  billing,
  onBillingTypeChange,
  onBillingChange,
}: BillingAddressSectionProps) {
  return (
    <div className="mb-10">
      <h2 className="text-base font-medium mb-4">Địa chỉ thanh toán</h2>

      <label
        className={`flex items-center gap-3 border px-4 py-3.5 cursor-pointer rounded-t-lg transition-colors ${
          billingType === "same" ? "border-black bg-gray-50" : "border-gray-300"
        }`}
      >
        <input
          type="radio"
          name="billing"
          value="same"
          checked={billingType === "same"}
          onChange={() => onBillingTypeChange("same")}
          className="accent-black"
        />
        <span className="text-sm">Giống địa chỉ vận chuyển</span>
      </label>

      <label
        className={`flex items-center gap-3 border-x border-b px-4 py-3.5 cursor-pointer transition-colors ${
          billingType === "different"
            ? "border-black bg-gray-50 rounded-b-none"
            : "border-gray-300 rounded-b-lg"
        }`}
      >
        <input
          type="radio"
          name="billing"
          value="different"
          checked={billingType === "different"}
          onChange={() => onBillingTypeChange("different")}
          className="accent-black"
        />
        <span className="text-sm">Sử dụng địa chỉ thanh toán khác</span>
      </label>

      {/* Animated billing address form */}
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: billingType === "different" ? "700px" : "0px",
          opacity: billingType === "different" ? 1 : 0,
        }}
      >
        <div className="border-x border-b border-gray-300 rounded-b-lg px-4 pt-5 pb-5 space-y-3 bg-gray-100">
          <AddressForm values={billing} onChange={onBillingChange} required={false} />
        </div>
      </div>
    </div>
  );
}
