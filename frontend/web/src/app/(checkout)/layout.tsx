import type { ReactNode } from "react";

// Minimal layout for checkout — no global Header/Footer
export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
