"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Product, Collection } from "@/lib/api/catalog";
import { ChevronDown } from "lucide-react";

interface CatalogFiltersProps {
  products: Product[];
  collections: Collection[];
  onFilter: (filtered: Product[]) => void;
}

export type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "newest";

const SORT_LABELS: Record<SortOption, string> = {
  default: "Mặc định",
  "price-asc": "Giá: Thấp → Cao",
  "price-desc": "Giá: Cao → Thấp",
  "name-asc": "Tên A → Z",
  newest: "Mới nhất",
};

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const arr = [...products];
  switch (sort) {
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "name-asc":
      return arr.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    case "newest":
      return arr.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    default:
      return arr;
  }
}

export function CatalogFilters({
  products,
  collections,
  onFilter,
}: CatalogFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [openRootId, setOpenRootId] = useState<string | null>(null);

  // Root collections only (parentId === null), sorted by displayOrder
  const rootCollections = useMemo(
    () =>
      collections
        .filter((c) => c.parentId === null)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [collections],
  );

  const priceStats = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 2000000 };
    const prices = products.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices) / 1000) * 1000,
      max: Math.ceil(Math.max(...prices) / 1000) * 1000,
    };
  }, [products]);

  // Initialise price range once stats are known
  useEffect(() => {
    if (priceRange === null) {
      setPriceRange([priceStats.min, priceStats.max]);
    }
  }, [priceStats, priceRange]);

  const effectivePriceRange = useMemo(
    () => priceRange ?? [priceStats.min, priceStats.max],
    [priceRange, priceStats.min, priceStats.max],
  );

  const applyFilters = useCallback(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCollection =
        selectedCollectionId === null ||
        product.collectionId === selectedCollectionId;

      const matchesPrice =
        product.price >= effectivePriceRange[0] &&
        product.price <= effectivePriceRange[1];

      return matchesSearch && matchesCollection && matchesPrice;
    });
    filtered = sortProducts(filtered, sortBy);
    onFilter(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    products,
    searchQuery,
    selectedCollectionId,
    effectivePriceRange,
    sortBy,
  ]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCollectionId(null);
    setPriceRange([priceStats.min, priceStats.max]);
    setSortBy("default");
    setOpenRootId(null);
  };

  const handleSubCollectionClick = (subId: string) => {
    setSelectedCollectionId((prev) => (prev === subId ? null : subId));
  };

  const handleRootToggle = (rootId: string) => {
    const willClose = openRootId === rootId;
    setOpenRootId(willClose ? null : rootId);
    // Clear selected sub-collection if we're collapsing its parent
    if (willClose) {
      const root = rootCollections.find((r) => r.id === rootId);
      const subIds = root?.subCollections.map((s) => s.id) ?? [];
      setSelectedCollectionId((prev) =>
        prev && subIds.includes(prev) ? null : prev,
      );
    }
  };

  return (
    <div className="space-y-6 text-sm text-black">
      {/* Search */}
      <div>
        <label className="block font-semibold mb-2">Tìm kiếm</label>
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black transition"
        />
      </div>

      {/* Sort */}
      <div>
        <label className="block font-semibold mb-2">Sắp xếp</label>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black transition bg-white pr-8"
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABELS[key]}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Chủ đề — root collections accordion */}
      <div>
        <label className="block font-semibold mb-3">Chủ đề</label>
        <div className="space-y-1">
          {/* All */}
          <button
            onClick={() => {
              setSelectedCollectionId(null);
              setOpenRootId(null);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg transition ${
              selectedCollectionId === null
                ? "bg-black text-white font-semibold"
                : "border border-gray-200 hover:border-gray-400"
            }`}
          >
            Tất cả
          </button>

          {rootCollections.map((root) => {
            const isOpen = openRootId === root.id;
            const subCollections = root.subCollections ?? [];
            const hasActiveChild = subCollections.some(
              (s) => s.id === selectedCollectionId,
            );

            return (
              <div key={root.id}>
                {/* Root row — toggle accordion */}
                <button
                  onClick={() => handleRootToggle(root.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
                    hasActiveChild
                      ? "bg-gray-100 font-semibold"
                      : "border border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <span>{root.name}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Sub-collection chips */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "max-h-[500px] opacity-100 mt-1.5"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="flex flex-wrap gap-1.5 pl-3 pb-1">
                    {subCollections.map((sub) => {
                      const isSelected = selectedCollectionId === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSubCollectionClick(sub.id)}
                          className={`px-2.5 py-1 rounded-full text-xs transition border ${
                            isSelected
                              ? "bg-black text-white border-black font-semibold"
                              : "border-gray-300 hover:border-gray-500 bg-white"
                          }`}
                        >
                          {sub.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block font-semibold mb-3">Khoảng giá</label>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Thấp nhất</span>
              <span className="font-medium text-gray-700">
                {effectivePriceRange[0].toLocaleString("vi-VN")}₫
              </span>
            </div>
            <input
              type="range"
              min={priceStats.min}
              max={priceStats.max}
              step={10000}
              value={effectivePriceRange[0]}
              onChange={(e) => {
                const v = Number(e.target.value);
                setPriceRange([
                  Math.min(v, effectivePriceRange[1] - 10000),
                  effectivePriceRange[1],
                ]);
              }}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Cao nhất</span>
              <span className="font-medium text-gray-700">
                {effectivePriceRange[1].toLocaleString("vi-VN")}₫
              </span>
            </div>
            <input
              type="range"
              min={priceStats.min}
              max={priceStats.max}
              step={10000}
              value={effectivePriceRange[1]}
              onChange={(e) => {
                const v = Number(e.target.value);
                setPriceRange([
                  effectivePriceRange[0],
                  Math.max(v, effectivePriceRange[0] + 10000),
                ]);
              }}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
          </div>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={resetFilters}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
      >
        Đặt lại bộ lọc
      </button>
    </div>
  );
}
