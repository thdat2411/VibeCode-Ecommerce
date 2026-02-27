interface PaymentSectionProps {
  paymentMethod: "bank" | "cod";
  onChange: (method: "bank" | "cod") => void;
}

export function PaymentSection({ paymentMethod, onChange }: PaymentSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-medium mb-1">Thanh toán</h2>
      <p className="text-xs text-gray-400 mb-4">
        Toàn bộ các giao dịch được bảo mật và mã hóa.
      </p>

      <label
        className={`flex items-center gap-3 border px-4 py-3.5 cursor-pointer rounded-t-lg transition-colors ${
          paymentMethod === "bank" ? "border-black bg-gray-50" : "border-gray-300"
        }`}
      >
        <input
          type="radio"
          name="payment"
          value="bank"
          checked={paymentMethod === "bank"}
          onChange={() => onChange("bank")}
          className="accent-black"
        />
        <span className="text-sm">Chuyển khoản qua tài khoản ngân hàng</span>
      </label>

      <label
        className={`flex items-center gap-3 border-x border-b px-4 py-3.5 cursor-pointer transition-colors ${
          paymentMethod === "cod"
            ? "border-black bg-gray-50"
            : "border-gray-300 rounded-b-lg"
        }`}
      >
        <input
          type="radio"
          name="payment"
          value="cod"
          checked={paymentMethod === "cod"}
          onChange={() => onChange("cod")}
          className="accent-black"
        />
        <span className="text-sm font-medium">
          Thanh toán khi nhận hàng (COD)
        </span>
      </label>

      {/* COD note — animated */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: paymentMethod === "cod" ? "80px" : "0px",
          opacity: paymentMethod === "cod" ? 1 : 0,
        }}
      >
        <div className="border-x border-b border-gray-300 px-4 py-3 bg-gray-50 rounded-b-lg">
          <p className="text-xs text-black">
            Quý khách vui lòng thanh toán cho đơn vị vận chuyển khi nhận hàng.
          </p>
        </div>
      </div>
    </div>
  );
}
