"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageCover from "@/components/layout/PageCover";
import { Suspense, type ReactNode } from "react";
import Loading from "@/app/loading";

// Routes that should NOT show the global header/footer
const BARE_ROUTES = ["/checkout"];

export default function ShellLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isBare = BARE_ROUTES.some((r) => pathname.startsWith(r));

  if (isBare) {
    return <Suspense fallback={<Loading />}>{children}</Suspense>;
  }

  return (
    <>
      <PageCover />
      <Header />
      <div className="min-h-screen">
        <Suspense fallback={<Loading />}>{children}</Suspense>
        <Footer />
      </div>
    </>
  );
}
