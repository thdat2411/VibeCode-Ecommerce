"use client";

import React from "react";
import Image from "next/image";

interface Highlight {
  icon: string;
  title: string;
  description: string;
}

interface ProductHighlightsProps {
  highlights: Highlight[];
}

export function ProductHighlights({ highlights }: ProductHighlightsProps) {
  if (highlights.length === 0) {
    return null;
  }

  return (
    <div className="border-t pt-12 mt-12">
      <h2 className="text-2xl font-bold mb-8">Product Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {highlights.map((highlight, index) => (
          <div key={index} className="text-center">
            {highlight.icon && (
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Image
                  src={highlight.icon}
                  alt={highlight.title}
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>
            )}
            <h3 className="font-semibold mb-2">{highlight.title}</h3>
            <p className="text-sm text-gray-600">{highlight.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
