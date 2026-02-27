import { SHIPPING_FEE } from "./checkoutConstants";

export function ShippingMethodSection() {
  return (
    <div className="mb-8">
      <h2 className="text-base font-medium mb-4">Phương thức vận chuyển</h2>
      <label className="flex items-center justify-between border border-black bg-gray-50 rounded-lg px-4 py-3.5 cursor-pointer">
        <div className="flex items-center gap-3">
          <input
            type="radio"
            name="shipping"
            defaultChecked
            className="accent-black"
          />
          <span className="text-sm">Giao hàng nhanh (GHN, SPX)</span>
        </div>
        <span className="text-sm font-medium">
          {SHIPPING_FEE.toLocaleString("vi-VN")}₫
        </span>
      </label>
    </div>
  );
}
