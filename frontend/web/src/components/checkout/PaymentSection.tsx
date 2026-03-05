export type PaymentMethod = "bank" | "cod" | "momo";

interface PaymentSectionProps {
  paymentMethod: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentSection({
  paymentMethod,
  onChange,
}: PaymentSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-medium mb-1">Thanh toán</h2>
      <p className="text-xs text-gray-400 mb-4">
        Toàn bộ các giao dịch được bảo mật và mã hóa.
      </p>

      {/* Bank transfer */}
      <label
        className={`flex items-center gap-3 border px-4 py-3.5 cursor-pointer rounded-t-lg transition-colors ${
          paymentMethod === "bank"
            ? "border-black bg-gray-50"
            : "border-gray-300"
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

      {/* MoMo */}
      <label
        className={`flex items-center gap-3 border-x border-b px-4 py-3.5 cursor-pointer transition-colors ${
          paymentMethod === "momo"
            ? "border-[#ae2070] bg-[#fff0f6]"
            : "border-gray-300"
        }`}
      >
        <input
          type="radio"
          name="payment"
          value="momo"
          checked={paymentMethod === "momo"}
          onChange={() => onChange("momo")}
          className="accent-[#ae2070]"
        />
        <span className="flex items-center gap-2 text-sm font-medium">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#ae2070] text-white text-[10px] font-bold leading-none select-none">
            M
          </span>
          Ví MoMo
        </span>
        <span className="ml-auto text-[10px] text-[#ae2070] font-medium tracking-wide">
          Chuyển hướng đến MoMo
        </span>
      </label>

      {/* MoMo note — animated */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: paymentMethod === "momo" ? "72px" : "0px",
          opacity: paymentMethod === "momo" ? 1 : 0,
        }}
      >
        <div className="border-x border-b border-[#ae2070] px-4 py-3 bg-[#fff0f6]">
          <p className="text-xs text-[#ae2070]">
            Bạn sẽ được chuyển đến trang thanh toán MoMo để hoàn tất đơn hàng.
          </p>
        </div>
      </div>

      {/* COD */}
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
