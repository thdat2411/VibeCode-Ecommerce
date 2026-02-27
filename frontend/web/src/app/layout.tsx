import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ShellLayout from "@/components/layout/ShellLayout";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { AddressProvider } from "@/lib/address-context";
import { NotificationProvider } from "@/lib/notification-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The New Originals Store",
  description: "Premium streetwear clothing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <AddressProvider>
                <NotificationProvider>
                  <ShellLayout>{children}</ShellLayout>
                </NotificationProvider>
              </AddressProvider>
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
