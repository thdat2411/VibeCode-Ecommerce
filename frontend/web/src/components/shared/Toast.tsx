"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type,
  duration = 3000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const accentBorder =
    type === "success"
      ? "border-l-green-500"
      : type === "error"
        ? "border-l-red-500"
        : "border-l-blue-500";

  return (
    <div
      className={`fixed top-4 right-4 bg-black text-white px-6 py-3 rounded border border-gray-800 border-l-4 ${accentBorder} shadow-lg animate-slide-in-up z-50`}
    >
      {message}
    </div>
  );
}
