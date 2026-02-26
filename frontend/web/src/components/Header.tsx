"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Menu,
  X,
  Instagram,
  Facebook,
  Youtube,
  Search,
  User,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { getCollections, type Collection } from "@/lib/api/catalog";
import { useCart } from "@/lib/cart-context";
import CartModal from "@/components/CartModal";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [navThemeRight, setNavThemeRight] = useState<"dark" | "light">("dark");
  const { itemCount } = useCart();
  const navLinkRefs = useRef<(HTMLAnchorElement | HTMLDivElement | null)[]>([]);
  const socialLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const rightIconsRef = useRef<HTMLDivElement | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  // Fetch collections on mount
  useEffect(() => {
    getCollections()
      .then((data) => setCollections(data))
      .catch((err) => console.error("Failed to fetch collections:", err));
  }, []);

  const rootCollections = useMemo(
    () =>
      collections
        .filter((c) => !c.parentId)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [collections],
  );

  // Stable lookup map — identity of each Collection object is preserved from the API response.
  const collectionsById = useMemo(() => {
    const map = new Map<string, Collection>();
    for (const c of collections) map.set(c.id, c);
    return map;
  }, [collections]);

  // Shape-only nav items: only hrefs / labels / flags — no embedded object references.
  // This array only rebuilds when the actual slugs / display-order / names change.
  const allNavItems = useMemo(() => {
    type NavItem = {
      href: string;
      label: string;
      collectionId?: string;
      parentId?: string;
      isSubItem?: boolean;
    };
    const items: NavItem[] = [{ href: "/", label: "HOME" }];
    for (const c of rootCollections) {
      items.push({
        href: `/collections/${c.slug}`,
        label: c.name.toUpperCase(),
        collectionId: c.id,
      });
      if (c.subCollections?.length) {
        for (const sub of [...c.subCollections].sort(
          (a, b) => a.displayOrder - b.displayOrder,
        )) {
          items.push({
            href: `/collections/${sub.slug}`,
            label: sub.name.toUpperCase(),
            collectionId: sub.id,
            parentId: c.id,
            isSubItem: true,
          });
        }
      }
    }
    items.push({ href: "/contact", label: "CONTACT" });
    return items;
  }, [rootCollections]);

  const socialLinks = useMemo(
    () => [
      { href: "https://instagram.com", Icon: Instagram },
      { href: "https://facebook.com", Icon: Facebook },
      { href: "https://youtube.com", Icon: Youtube },
    ],
    [],
  );

  const [navLinkThemes, setNavLinkThemes] = useState<("dark" | "light")[]>([]);
  const [socialLinkThemes, setSocialLinkThemes] = useState<
    ("dark" | "light")[]
  >([]);

  const resolveThemeAtPoint = (x: number, y: number) => {
    if (typeof document === "undefined") return undefined;
    const stack = document.elementsFromPoint(x, y);
    const section = stack
      .map((element) => (element as HTMLElement).closest("[data-nav-theme]"))
      .find(Boolean) as HTMLElement | undefined;
    const theme = section?.getAttribute("data-nav-theme");
    return theme === "light" || theme === "dark" ? theme : undefined;
  };

  const sampleCenter = (element: HTMLElement | null) => {
    if (!element) return undefined;
    const rect = element.getBoundingClientRect();
    const x = Math.min(
      Math.max(rect.left + rect.width / 2, 0),
      window.innerWidth - 1,
    );
    // Sample directly below the element (at its vertical center + 60px to find content below)
    const y = Math.min(rect.top + rect.height, window.innerHeight - 1);
    return resolveThemeAtPoint(x, y);
  };

  const triggerThemeUpdate = useCallback(() => {
    setNavLinkThemes((prevThemes) =>
      navLinkRefs.current.map(
        (node, index) =>
          sampleCenter(node as HTMLElement) ?? prevThemes[index] ?? "dark",
      ),
    );
    setSocialLinkThemes((prevThemes) =>
      socialLinkRefs.current.map(
        (node, index) => sampleCenter(node) ?? prevThemes[index] ?? "dark",
      ),
    );
    const rightTheme = sampleCenter(rightIconsRef.current);
    if (rightTheme) setNavThemeRight(rightTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setNavLinkThemes(allNavItems.map(() => "dark"));
    setSocialLinkThemes(socialLinks.map(() => "dark"));
    setTimeout(triggerThemeUpdate, 0);
  }, [allNavItems, socialLinks, triggerThemeUpdate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleDataLoadComplete = () => {
      triggerThemeUpdate();
      window.removeEventListener("dataLoadComplete", handleDataLoadComplete);
    };
    window.addEventListener("dataLoadComplete", handleDataLoadComplete);
    const fallbackTimeout = setTimeout(triggerThemeUpdate, 2000);
    return () => {
      window.removeEventListener("dataLoadComplete", handleDataLoadComplete);
      clearTimeout(fallbackTimeout);
    };
  }, [pathname, triggerThemeUpdate]);

  useEffect(() => {
    const updateThemes = () => requestAnimationFrame(triggerThemeUpdate);
    window.addEventListener("scroll", updateThemes, { passive: true });
    window.addEventListener("resize", updateThemes);
    return () => {
      window.removeEventListener("scroll", updateThemes);
      window.removeEventListener("resize", updateThemes);
    };
  }, [triggerThemeUpdate]);

  const isLightRight = navThemeRight === "light";

  const textColorRight = isLightRight ? "text-black" : "text-white";

  const hoverColorRight = isLightRight
    ? "hover:text-gray-700"
    : "hover:text-gray-300";
  const badgeStyles = isLightRight
    ? "bg-black text-white"
    : "bg-white text-black";

  return (
    <header
      className="fixed inset-0 z-50 pointer-events-none"
      suppressHydrationWarning
    >
      {/* Brand area - top left (desktop only - hidden on tablet and mobile) */}
      <div
        className="pointer-events-auto fixed lg:left-[16.5%] top-8 z-50 hidden lg:block"
        suppressHydrationWarning
      >
        <Link
          href="/"
          className={`text-2xl font-semibold tracking-wide drop-shadow ${navThemeRight === "light" ? "text-black" : "text-white"}`}
        >
          the new
          <br />
          originals
        </Link>
      </div>

      {/* Left fixed navbar (desktop only - hidden on tablet and mobile) */}
      <div
        className="pointer-events-auto fixed left-0 top-0 hidden h-full w-48 flex-col justify-between px-6 py-6 lg:flex"
        suppressHydrationWarning
      >
        {/* Navigation links at top */}
        <nav className="flex flex-col items-start space-y-3 text-[11px] font-normal tracking-widest">
          {allNavItems.map((item, index) => {
            const isLight = navLinkThemes[index] === "light";
            const linkTextColor = isLight ? "text-black" : "text-white";
            const linkHoverColor = isLight
              ? "hover:text-gray-700"
              : "hover:text-gray-300";

            // Sub-items are rendered as children inside the parent block below
            if (item.isSubItem) return null;

            const col = item.collectionId
              ? collectionsById.get(item.collectionId)
              : undefined;
            const hasSubs =
              col?.subCollections && col.subCollections.length > 0;

            if (hasSubs && col) {
              const isOpen = openDropdown === col.id;
              // Collect flat-list indices for sub-items of this parent
              const subIndices: number[] = [];
              for (let i = index + 1; i < allNavItems.length; i++) {
                if (allNavItems[i].parentId === col.id) subIndices.push(i);
                else if (!allNavItems[i].isSubItem) break;
              }
              return (
                <div
                  key={item.href}
                  className="w-full"
                  ref={(node) => {
                    navLinkRefs.current[index] = node;
                  }}
                >
                  {/* Row: link + chevron toggle */}
                  <div className="flex items-center gap-1">
                    <Link
                      href={item.href}
                      className={`flex-1 ${linkTextColor} ${linkHoverColor} transition`}
                      onClick={() => setOpenDropdown(null)}
                    >
                      {item.label}
                    </Link>
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : col.id)}
                      className={`${linkTextColor} ${linkHoverColor} transition p-0.5`}
                      aria-label="Toggle sub-collections"
                    >
                      <ChevronDown
                        size={10}
                        className={`transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : "rotate-0"}`}
                      />
                    </button>
                  </div>

                  {/* Animated inline sub-collection list — each link has its own ref for theme sampling */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pl-3 pt-2 pb-1 flex flex-col space-y-2">
                      {subIndices.map((subIdx) => {
                        const sub = allNavItems[subIdx];
                        const subIsLight = navLinkThemes[subIdx] === "light";
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            ref={(node) => {
                              navLinkRefs.current[subIdx] =
                                node as HTMLAnchorElement;
                            }}
                            className={`text-[10px] tracking-widest transition ${
                              subIsLight
                                ? "text-gray-600 hover:text-black"
                                : "text-white/60 hover:text-white"
                            }`}
                            onClick={() => setOpenDropdown(null)}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                ref={(node) => {
                  navLinkRefs.current[index] = node as HTMLAnchorElement;
                }}
                className={`${linkTextColor} ${linkHoverColor} transition`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Social icons at bottom */}
        <div className="flex items-center space-x-4">
          {socialLinks.map((item, index) => {
            const isLight = socialLinkThemes[index] === "light";
            const linkBg = isLight ? "bg-black" : "bg-white";
            const linkFg = isLight ? "text-white" : "text-black";
            const linkHover = isLight
              ? "hover:text-gray-200"
              : "hover:text-gray-700";
            const Icon = item.Icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                ref={(node) => {
                  socialLinkRefs.current[index] = node;
                }}
                className={`w-6 h-6 rounded-full flex items-center justify-center ${linkBg} ${linkFg} ${linkHover} transition`}
              >
                <Icon size={14} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right icons (desktop only - hidden on tablet and mobile) */}
      <div
        ref={rightIconsRef}
        className={`pointer-events-auto fixed right-8 top-8 hidden items-center space-x-6 lg:flex ${textColorRight} z-50`}
        suppressHydrationWarning
      >
        <button className={`${hoverColorRight} transition`}>
          <Search size={20} />
        </button>
        <Link href="/dashboard" className={`${hoverColorRight} transition`}>
          <User size={20} />
        </Link>
        <button
          onClick={() => setIsCartOpen(true)}
          className={`relative ${hoverColorRight} transition`}
          aria-label="Mở giỏ hàng"
        >
          <ShoppingCart size={20} />
          <span
            className={`absolute -top-2 -right-3 text-[10px] rounded-full w-5 h-5 flex items-center justify-center ${badgeStyles}`}
          >
            {itemCount}
          </span>
        </button>
      </div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Tablet and Mobile header with brand and menu button (shown below lg) */}
      <div className="pointer-events-auto fixed top-0 left-0 right-0 h-20 bg-white lg:hidden z-40 flex items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-black">
          THE NEW
          <br />
          ORIGINALS
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-black hover:text-gray-700 transition relative w-6 h-6"
          aria-label="Toggle menu"
        >
          <span
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              mobileMenuOpen
                ? "opacity-0 rotate-90 scale-50"
                : "opacity-100 rotate-0 scale-100"
            }`}
          >
            <Menu size={24} />
          </span>
          <span
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              mobileMenuOpen
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-50"
            }`}
          >
            <X size={24} />
          </span>
        </button>
      </div>

      {/* Mobile / Tablet menu overlay */}
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
            onClick={() => setMobileMenuOpen(false)}
          >
            the new originals
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-white hover:text-gray-200 transition"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col text-sm font-semibold tracking-widest">
          <Link
            href="/"
            className="py-3 border-b border-white/10 hover:text-gray-300 transition"
            onClick={() => setMobileMenuOpen(false)}
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
                    onClick={() => setMobileMenuOpen(false)}
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
                            onClick={() => setMobileMenuOpen(false)}
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
            onClick={() => setMobileMenuOpen(false)}
          >
            CONTACT
          </Link>
        </nav>
      </div>
    </header>
  );
}
