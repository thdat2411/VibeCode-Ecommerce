"use client";

import { useState, useMemo } from "react";
import { Product } from "@/lib/api/catalog";

interface CatalogFiltersProps {
  products: Product[];
  onFilter: (filtered: Product[]) => void;
}

export function CatalogFilters({ products, onFilter }: CatalogFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products],
  );

  const priceStats = useMemo(() => {
    const prices = products.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  // Filter products based on all criteria
  useMemo(() => {
    const filtered = products.filter((product) => {
      // Search filter (name or description)
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      // Price filter
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });

    onFilter(filtered);
  }, [searchQuery, selectedCategory, priceRange, products, onFilter]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handlePriceChange = (type: "min" | "max", value: number) => {
    if (type === "min") {
      setPriceRange([Math.min(value, priceRange[1]), priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], Math.max(value, priceRange[0])]);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange([priceStats.min, priceStats.max]);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div>
        <label className="block text-sm font-semibold mb-2">Search</label>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
        />
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-semibold mb-3">Category</label>
        <div className="space-y-2">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`w-full text-left px-3 py-2 rounded transition ${
              selectedCategory === "all"
                ? "bg-black text-white font-semibold"
                : "border border-gray-300 hover:border-black"
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`w-full text-left px-3 py-2 rounded transition ${
                selectedCategory === category
                  ? "bg-black text-white font-semibold"
                  : "border border-gray-300 hover:border-black"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block text-sm font-semibold mb-3">Price Range</label>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-600">
              Min: ${priceRange[0]}
            </label>
            <input
              type="range"
              min={priceStats.min}
              max={priceStats.max}
              value={priceRange[0]}
              onChange={(e) => handlePriceChange("min", Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">
              Max: ${priceRange[1]}
            </label>
            <input
              type="range"
              min={priceStats.min}
              max={priceStats.max}
              value={priceRange[1]}
              onChange={(e) => handlePriceChange("max", Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
      >
        Reset Filters
      </button>
    </div>
  );
}
