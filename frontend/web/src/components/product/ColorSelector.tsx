"use client";

import React from "react";
import Image from "next/image";

interface ColorOption {
  name: string;
  thumbnail: string;
  isAvailable?: boolean;
}

interface ColorSelectorProps {
  colors: ColorOption[];
  selectedColor: string | null;
  onColorChange: (color: string) => void;
}

export function ColorSelector({
  colors,
  selectedColor,
  onColorChange,
}: ColorSelectorProps) {
  if (colors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold">
        MÀU — {selectedColor?.toUpperCase() || "SELECT"}
      </label>
      <div className="flex flex-wrap gap-4">
        {colors.map((color) => (
          <div key={color.name} className="relative group">
            <button
              onClick={() => onColorChange(color.name)}
              disabled={color.isAvailable === false}
              className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                selectedColor === color.name
                  ? "border-black"
                  : "border-gray-300 hover:border-black"
              } ${color.isAvailable === false ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Image
                src={color.thumbnail}
                alt={color.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </button>
            {/* Tooltip - shown on hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {color.name.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
