"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createOrder } from "@/lib/api/orders";
import { processCheckout } from "@/lib/api/payments";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { SHIPPING_FEE } from "@/components/checkout/checkoutConstants";
import { ContactSection } from "@/components/checkout/ContactSection";
import { ShippingAddressSection } from "@/components/checkout/ShippingAddressSection";
import { ShippingMethodSection } from "@/components/checkout/ShippingMethodSection";
import { PaymentSection } from "@/components/checkout/PaymentSection";
import { BillingAddressSection } from "@/components/checkout/BillingAddressSection";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import type { AddressFormValues } from "@/components/checkout/AddressForm";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, loading, clearCart } = useCart();
  const { authenticated, user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [billingType, setBillingType] = useState<"same" | "different">("same");
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "cod">("cod");
  const [saveInfo, setSaveInfo] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [newsletterSms, setNewsletterSms] = useState(false);

  const [form, setForm] = useState<AddressFormValues & { email: string }>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    ward: "",
    district: "",
    province: "",
    postalCode: "",
    phone: "",
  });
  const [billing, setBilling] = useState<AddressFormValues>({
    firstName: "",
    lastName: "",
    address: "",
    ward: "",
    district: "",
    province: "",
    postalCode: "",
    phone: "",
  });

  useEffect(() => {
    if (user?.email) setForm((f) => ({ ...f, email: user.email }));
  }, [user]);
  useEffect(() => {
    window.dispatchEvent(new Event("dataLoadComplete"));
  }, []);

  function updateForm(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  function updateBilling(field: string, value: string) {
    setBilling((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    try {
      const shippingAddress = {
        street: `${form.address}, ${form.ward}, ${form.district}`,
        city: form.province,
        state: form.province,
        postalCode: form.postalCode || "000000",
        country: "VN",
      };
      await createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: total + SHIPPING_FEE,
        status: "pending",
        shippingAddress,
      });
      const paymentResponse = await processCheckout({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress,
      });
      if (paymentResponse.clientSecret || paymentMethod === "cod") {
        clearCart();
        router.push("/");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setProcessing(false);
    }
  }

  if (loading)
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-sm tracking-widest uppercase text-gray-400">
          Đang tải...
        </p>
      </div>
    );

  if (items.length === 0)
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
        <p className="text-sm tracking-widest uppercase text-gray-500">
          Giỏ hàng của bạn đang trống
        </p>
        <Link
          href="/catalog"
          className="border border-black text-black px-8 py-3 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 py-5 px-6 lg:px-16">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.25em] uppercase"
        >
          the new originals
        </Link>
      </header>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
          <div className="flex-1 px-6 py-10 lg:px-16 lg:py-12 lg:border-r border-gray-200">
            <form onSubmit={handleCheckout} className="max-w-[520px]">
              <ContactSection
                email={form.email}
                newsletter={newsletter}
                authenticated={authenticated}
                onEmailChange={(v) => updateForm("email", v)}
                onNewsletterChange={setNewsletter}
              />
              <ShippingAddressSection
                values={form}
                saveInfo={saveInfo}
                newsletterSms={newsletterSms}
                onChange={updateForm}
                onSaveInfoChange={setSaveInfo}
                onNewsletterSmsChange={setNewsletterSms}
              />
              <ShippingMethodSection />
              <PaymentSection
                paymentMethod={paymentMethod}
                onChange={setPaymentMethod}
              />
              <BillingAddressSection
                billingType={billingType}
                billing={billing}
                onBillingTypeChange={setBillingType}
                onBillingChange={updateBilling}
              />
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-black text-white py-4 text-sm tracking-widest uppercase hover:bg-gray-800 active:bg-gray-900 transition disabled:bg-gray-400 rounded-lg"
              >
                {processing ? "Đang xử lý..." : "Đặt hàng"}
              </button>
              <div className="mt-8 pb-10">
                <Link
                  href="/privacy"
                  className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600 transition"
                >
                  Chính sách quyền riêng tư
                </Link>
              </div>
            </form>
          </div>
          <OrderSummary items={items} total={total} />
        </div>
      </div>
    </div>
  );
}
