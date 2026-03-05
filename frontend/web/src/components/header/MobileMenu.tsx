"use client";

import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { type Collection } from "@/lib/api/catalog";

interface MobileMenuProps {
  mobileMenuOpen: boolean;
  onClose: () => void;
  rootCollections: Collection[];
  mobileExpanded: string | null;
  setMobileExpanded: (id: string | null) => void;
}

export function MobileMenu({
  mobileMenuOpen,
  onClose,
  rootCollections,
  mobileExpanded,
  setMobileExpanded,
}: MobileMenuProps) {
  return (
    <div
      className={`pointer-events-auto fixed inset-0 bg-black/95 text-white p-6 lg:hidden overflow-y-auto z-50 transition-all duration-300 ease-in-out ${
        mobileMenuOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/"
          className="text-xl font-semibold uppercase"
          onClick={onClose}
        >
          the new originals
        </Link>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="flex flex-col text-sm font-semibold tracking-widest">
        <Link
          href="/"
          className="py-3 border-b border-white/10 hover:text-gray-300 transition"
          onClick={onClose}
        >
          HOME
        </Link>

        {rootCollections.map((col) => {
          const hasSubs = col.subCollections && col.subCollections.length > 0;
          const isExpanded = mobileExpanded === col.id;
          return (
            <div key={col.id} className="border-b border-white/10">
              <div className="flex items-center justify-between py-3">
                <Link
                  href={`/collections/${col.slug}`}
                  className="hover:text-gray-300 transition flex-1"
                  onClick={onClose}
                >
                  {col.name.toUpperCase()}
                </Link>
                {hasSubs && (
                  <button
                    className="p-1 text-white/60 hover:text-white transition"
                    onClick={() =>
                      setMobileExpanded(isExpanded ? null : col.id)
                    }
                    aria-label="Toggle sub-collections"
                  >
                    <ChevronRight
                      size={16}
                      className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </button>
                )}
              </div>
              {hasSubs && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded
                      ? "max-h-[800px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pl-4 pb-3 space-y-2">
                    {col.subCollections
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/collections/${sub.slug}`}
                          className="block py-2 text-xs text-white/70 hover:text-white tracking-widest transition"
                          onClick={onClose}
                        >
                          {sub.name.toUpperCase()}
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <Link
          href="/contact"
          className="py-3 border-b border-white/10 hover:text-gray-300 transition"
          onClick={onClose}
        >
          CONTACT
        </Link>
      </nav>
    </div>
  );
}
