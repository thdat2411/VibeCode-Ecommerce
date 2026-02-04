"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 30;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Prevent hydration mismatch by only rendering after mount
  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideRight {
          from {
            transform: scaleX(0);
            transform-origin: left;
          }
          to {
            transform: scaleX(1);
            transform-origin: left;
          }
        }

        .loading-container {
          animation: fadeIn 0.6s ease-out;
        }

        .loading-logo {
          animation: scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .progress-bar-fill {
          animation: slideRight 0.4s ease-out;
        }
      `}</style>

      <div className="loading-container flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="loading-logo">
          <div className="w-20 h-20 flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-black"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Geometric logo - abstract brand mark */}
              <rect
                x="20"
                y="20"
                width="60"
                height="60"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="15"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <line
                x1="50"
                y1="35"
                x2="50"
                y2="20"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="50"
                y1="80"
                x2="50"
                y2="65"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="35"
                y1="50"
                x2="20"
                y2="50"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="80"
                y1="50"
                x2="65"
                y2="50"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Brand Text */}
        <div className="text-center">
          <h1 className="text-2xl font-light tracking-widest text-black">
            THE NEW ORIGINALS
          </h1>
          <p className="text-xs text-gray-500 tracking-widest mt-2 uppercase">
            Loading
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-64">
          {/* Track */}
          <div className="h-1 bg-gray-200 relative overflow-hidden">
            {/* Fill */}
            <div
              className="progress-bar-fill h-full bg-black transition-all ease-out duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Progress Percentage */}
        <p className="text-xs text-gray-400 tracking-widest">
          {Math.round(Math.min(progress, 100))}%
        </p>
      </div>
    </div>
  );
}
