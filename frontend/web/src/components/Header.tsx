"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Menu,
  X,
  Instagram,
  Facebook,
  Youtube,
  Search,
  User,
  ShoppingCart,
} from "lucide-react";
import { getCollections, type Collection } from "@/lib/api/catalog";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [navThemeRight, setNavThemeRight] = useState<"dark" | "light">("dark");
  const navLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const socialLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const rightIconsRef = useRef<HTMLDivElement | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);

  // Fetch collections on mount
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getCollections();
        setCollections(data);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      }
    };
    fetchCollections();
  }, []);

  const navLinks = useMemo(() => {
    const links = [{ href: "/", label: "HOME" }];

    // Add collection links dynamically
    collections.forEach((collection) => {
      links.push({
        href: `/collections/${collection.slug}`,
        label: collection.name.toUpperCase(),
      });
    });

    links.push({ href: "/contact", label: "CONTACT" });
    return links;
  }, [collections]);

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

  const triggerThemeUpdate = () => {
    setNavLinkThemes((prevThemes) =>
      navLinkRefs.current.map(
        (node, index) => sampleCenter(node) ?? prevThemes[index] ?? "dark",
      ),
    );
    setSocialLinkThemes((prevThemes) =>
      socialLinkRefs.current.map(
        (node, index) => sampleCenter(node) ?? prevThemes[index] ?? "dark",
      ),
    );

    const rightTheme = sampleCenter(rightIconsRef.current);
    if (rightTheme) {
      setNavThemeRight(rightTheme);
    }
  };

  useEffect(() => {
    // Initialize mounted flag and themes on mount
    setMounted(true);
    setNavLinkThemes(navLinks.map(() => "dark"));
    setSocialLinkThemes(socialLinks.map(() => "dark"));
    // Trigger theme update immediately after mount
    setTimeout(() => {
      triggerThemeUpdate();
    }, 0);
  }, [navLinks, socialLinks]);

  useEffect(() => {
    // Handle route changes - reset scroll to top
    window.scrollTo(0, 0);

    // Listen for data load completion after route change
    const handleDataLoadComplete = () => {
      triggerThemeUpdate();
      window.removeEventListener("dataLoadComplete", handleDataLoadComplete);
    };

    window.addEventListener("dataLoadComplete", handleDataLoadComplete);

    // Fallback: trigger after 2 seconds if data load event doesn't fire
    const fallbackTimeout = setTimeout(() => {
      triggerThemeUpdate();
    }, 2000);

    return () => {
      window.removeEventListener("dataLoadComplete", handleDataLoadComplete);
      clearTimeout(fallbackTimeout);
    };
  }, [pathname]);

  useEffect(() => {
    const updateThemes = () => {
      requestAnimationFrame(() => {
        triggerThemeUpdate();
      });
    };

    window.addEventListener("scroll", updateThemes, { passive: true });
    window.addEventListener("resize", updateThemes);
    return () => {
      window.removeEventListener("scroll", updateThemes);
      window.removeEventListener("resize", updateThemes);
    };
  }, []);

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
        <nav className="flex flex-col items-start space-y-3 text-[10px] font-normal  tracking-widest">
          {navLinks.map((item, index) => {
            const isLight = navLinkThemes[index] === "light";
            const linkTextColor = isLight ? "text-black" : "text-white";
            const linkHoverColor = isLight
              ? "hover:text-gray-700"
              : "hover:text-gray-300";

            return (
              <Link
                key={item.href}
                href={item.href}
                ref={(node) => {
                  navLinkRefs.current[index] = node;
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
        <Link href="/cart" className={`relative ${hoverColorRight} transition`}>
          <ShoppingCart size={20} />
          <span
            className={`absolute -top-2 -right-3 text-[10px] rounded-full w-5 h-5 flex items-center justify-center ${badgeStyles}`}
          >
            0
          </span>
        </Link>
      </div>

      {/* Tablet and Mobile header with brand and menu button (shown below lg) */}
      <div className="pointer-events-auto fixed top-0 left-0 right-0 h-20 bg-white lg:hidden z-40 flex items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-black">
          THE NEW
          <br />
          ORIGINALS
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-black hover:text-gray-700 transition"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile/Tablet menu overlay (shown below lg) */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto fixed inset-0 bg-black/90 text-white p-6 lg:hidden">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="text-xl font-semibold uppercase">
              the new originals
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-gray-200 transition"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col space-y-4 text-sm font-semibold tracking-widest">
            <Link href="/">HOME</Link>
            <Link href="/collections/relaxed-fit">ÁO THUN RELAXED FIT</Link>
            <Link href="/collections/long-sleeve">ÁO THUN DÀI TAY</Link>
            <Link href="/collections/ringer">ÁO THUN RINGER</Link>
            <Link href="/collections/hoodie">ÁO HOODIE</Link>
            <Link href="/collections/sweater">ÁO SWEATER</Link>
            <Link href="/collections/jogger">QUẦN JOGGER & ỐNG SUÔNG</Link>
            <Link href="/collections/soft-routine">SOFT ROUTINE</Link>
            <Link href="/contact">CONTACT</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
