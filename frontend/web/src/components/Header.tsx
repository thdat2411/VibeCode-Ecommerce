"use client";

import Link from "next/link";
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

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navThemeTop, setNavThemeTop] = useState<"dark" | "light">("dark");
  const [navThemeBottom, setNavThemeBottom] = useState<"dark" | "light">(
    "dark",
  );
  const [navThemeRight, setNavThemeRight] = useState<"dark" | "light">("dark");
  const navLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const socialLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const rightIconsRef = useRef<HTMLDivElement | null>(null);

  const navLinks = useMemo(
    () => [
      { href: "/", label: "HOME" },
      { href: "/collections/relaxed-fit", label: "ÁO THUN RELAXED FIT" },
      { href: "/collections/long-sleeve", label: "ÁO THUN DÀI TAY" },
      { href: "/collections/ringer", label: "ÁO THUN RINGER" },
      { href: "/collections/hoodie", label: "ÁO HOODIE" },
      { href: "/collections/sweater", label: "ÁO SWEATER" },
      { href: "/collections/jogger", label: "QUẦN JOGGER & ỐNG SUÔNG" },
      { href: "/collections/soft-routine", label: "SOFT ROUTINE" },
      { href: "/contact", label: "CONTACT" },
    ],
    [],
  );

  const socialLinks = useMemo(
    () => [
      { href: "https://instagram.com", Icon: Instagram },
      { href: "https://facebook.com", Icon: Facebook },
      { href: "https://youtube.com", Icon: Youtube },
    ],
    [],
  );

  const [navLinkThemes, setNavLinkThemes] = useState<("dark" | "light")[]>(() =>
    navLinks.map(() => "dark"),
  );
  const [socialLinkThemes, setSocialLinkThemes] = useState<
    ("dark" | "light")[]
  >(() => socialLinks.map(() => "dark"));

  useEffect(() => {
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
      const y = Math.min(
        Math.max(rect.top + rect.height / 2, 0),
        window.innerHeight - 1,
      );
      return resolveThemeAtPoint(x, y);
    };

    const updateThemes = () => {
      const nextNavThemes = navLinkRefs.current.map(
        (node, index) => sampleCenter(node) ?? navLinkThemes[index] ?? "dark",
      );
      const nextSocialThemes = socialLinkRefs.current.map(
        (node, index) =>
          sampleCenter(node) ?? socialLinkThemes[index] ?? "dark",
      );
      const rightTheme = sampleCenter(rightIconsRef.current);

      setNavLinkThemes(nextNavThemes);
      setSocialLinkThemes(nextSocialThemes);
      setNavThemeTop(nextNavThemes[0] ?? "dark");
      setNavThemeBottom(nextSocialThemes[0] ?? "dark");
      setNavThemeRight((prev) => rightTheme ?? prev);
    };

    updateThemes();
    window.addEventListener("scroll", updateThemes, { passive: true });
    window.addEventListener("resize", updateThemes);
    return () => {
      window.removeEventListener("scroll", updateThemes);
      window.removeEventListener("resize", updateThemes);
    };
  }, [navLinkThemes, socialLinkThemes]);

  const isLightTop = navThemeTop === "light";
  const isLightBottom = navThemeBottom === "light";
  const isLightRight = navThemeRight === "light";

  const textColorTop = isLightTop ? "text-black" : "text-white";
  const textColorBottom = isLightBottom ? "text-black" : "text-white";
  const textColorRight = isLightRight ? "text-black" : "text-white";
  const hoverColorTop = isLightTop
    ? "hover:text-gray-700"
    : "hover:text-gray-300";
  const hoverColorBottom = isLightBottom
    ? "hover:text-gray-700"
    : "hover:text-gray-300";
  const hoverColorRight = isLightRight
    ? "hover:text-gray-700"
    : "hover:text-gray-300";
  const badgeStyles = isLightRight
    ? "bg-black text-white"
    : "bg-white text-black";
  const iconBadgeBg = isLightBottom ? "bg-black" : "bg-white";
  const iconBadgeFg = isLightBottom ? "text-white" : "text-black";

  return (
    <header className="fixed inset-0 z-50 pointer-events-none">
      {/* Left fixed navbar */}
      <div className="pointer-events-auto fixed left-0 top-0 hidden h-full w-48 flex-col justify-between px-6 py-6 md:flex">
        {/* Navigation links at top */}
        <nav className="flex flex-col items-start space-y-3 text-xs font-normal tracking-widest">
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

      <div
        ref={rightIconsRef}
        className={`pointer-events-auto fixed right-8 top-8 hidden items-center space-x-6 md:flex ${textColorRight} z-50`}
      >
        <button className={`${hoverColorRight} transition`}>
          <Search size={20} />
        </button>
        <Link href="/auth/signin" className={`${hoverColorRight} transition`}>
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

      <div className="pointer-events-auto fixed right-6 top-6 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`${textColorRight} ${hoverColorRight} transition`}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="pointer-events-auto fixed inset-0 bg-black/90 text-white p-6 md:hidden">
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
