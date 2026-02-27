"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  productName: string;
  mainImageAlt?: string;
}

export function ImageGallery({
  images,
  productName,
  mainImageAlt = productName,
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handlePrevious = () => {
    setIsTransitioning(true);
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  if (images.length === 0) {
    return (
      <div className="aspect-square  rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No image available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image with Navigation */}
      <div className="relative aspect-square  rounded-lg overflow-hidden group">
        <Image
          key={images[selectedIndex]}
          src={images[selectedIndex]}
          alt={`${mainImageAlt} - View ${selectedIndex + 1}`}
          fill
          className={`object-cover transition-opacity duration-150 ease-in-out group-hover:opacity-75 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />

        {/* Navigation Arrows - Show only if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Grid - Show thumbnails if multiple images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setSelectedIndex(index);
                setTimeout(() => setIsTransitioning(false), 500);
              }}
              className={`aspect-square relative rounded-lg overflow-hidden border-2 transition-colors ${
                index === selectedIndex
                  ? "border-black"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={image}
                alt={`${mainImageAlt} thumbnail ${index + 1}`}
                fill
                className="object-cover transition-opacity duration-300 group-hover:opacity-70 hover:opacity-70"
                sizes="(max-width: 1024px) 25vw, 12.5vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
