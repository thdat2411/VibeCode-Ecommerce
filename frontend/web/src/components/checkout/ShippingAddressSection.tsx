import { AddressForm, AddressFormValues } from "./AddressForm";

interface ShippingAddressSectionProps {
  values: AddressFormValues;
  saveInfo: boolean;
  newsletterSms: boolean;
  onChange: (field: string, value: string) => void;
  onSaveInfoChange: (checked: boolean) => void;
  onNewsletterSmsChange: (checked: boolean) => void;
}

export function ShippingAddressSection({
  values,
  saveInfo,
  newsletterSms,
  onChange,
  onSaveInfoChange,
  onNewsletterSmsChange,
}: ShippingAddressSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-medium mb-4">Giao hàng</h2>

      <AddressForm values={values} onChange={onChange} required />

      <div className="mt-4 space-y-2">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={saveInfo}
            onChange={(e) => onSaveInfoChange(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 accent-black"
          />
          <span className="text-sm text-gray-700">
            Lưu lại thông tin này cho lần sau
          </span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={newsletterSms}
            onChange={(e) => onNewsletterSmsChange(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 accent-black"
          />
          <span className="text-sm text-gray-700">
            Gửi cho tôi tin tức và ưu đãi qua tin nhắn
          </span>
        </label>
      </div>
    </div>
  );
}
