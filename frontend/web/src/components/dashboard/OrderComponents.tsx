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

export const OrderDetailField = ({
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

export const OrderCard = ({ order }: { order: Order }) => (
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

export const OrderHistoryRow = ({ order }: { order: Order }) => (
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
