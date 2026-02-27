"use client";
import { useState, useEffect } from "react";

/**
 * Full-screen white overlay that hides the page until the header has
 * completed its first theme-detection pass (fires the custom "themeReady"
 * event).  This prevents the flash where the header briefly shows the
 * wrong link colour before the first triggerThemeUpdate call resolves.
 */
export default function PageCover() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const hide = () => {
      setFading(true);
      setTimeout(() => setVisible(false), 350);
    };

    // Hide once Header has completed its first theme sample on this route.
    window.addEventListener("themeReady", hide, { once: true });
    // Also hide when a page signals its own data is ready.
    window.addEventListener("dataLoadComplete", hide, { once: true });
    // Safety fallback – ensures the cover never blocks the UI.
    const fallback = setTimeout(hide, 600);

    return () => {
      window.removeEventListener("themeReady", hide);
      window.removeEventListener("dataLoadComplete", hide);
      clearTimeout(fallback);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 bg-white pointer-events-none transition-opacity duration-[350ms] ease-in-out ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      style={{ zIndex: 99999 }}
    />
  );
}
