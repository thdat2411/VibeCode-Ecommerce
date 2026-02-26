"use client";

import { useState, useMemo, useEffect } from "react";
import { Product } from "@/lib/api/catalog";
import { CollectionGrid } from "./CollectionGrid";
import { CollectionPagination } from "./CollectionPagination";
import { SlidersHorizontal } from "lucide-react";

interface CollectionWrapperProps {
  category: string;
  categoryName: string;
  products: Product[];
  currentPage: number;
  sortBy: string;
}

const PRODUCTS_PER_PAGE = 12;

// Normalize products to ensure all required fields are present
function normalizeProducts(products: Product[]): Product[] {
  return products
    .filter(
      (product): product is Product =>
        product !== null && product !== undefined,
    )
    .map((product) => ({
      ...product,
      variantOptions: product.variantOptions || [],
      variantImages: product.variantImages || [],
    }));
}

export function CollectionWrapper({
  category,
  categoryName,
  products: rawProducts,
  currentPage,
  sortBy: initialSort,
}: CollectionWrapperProps) {
  const products = normalizeProducts(rawProducts);

  // Debug logging
  if (typeof window !== "undefined") {
    console.log("CollectionWrapper received rawProducts:", rawProducts);
    console.log("CollectionWrapper normalized products:", products);
  }

  const [sortBy, setSortBy] = useState(initialSort);
  const [showFilters, setShowFilters] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(true);
  const [collectionOpen, setCollectionOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(true);
  const [sizeOpen, setSizeOpen] = useState(true);
  const [collectionSelected, setCollectionSelected] = useState(true);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [isCloseHover, setIsCloseHover] = useState(false);

  useEffect(() => {
    if (showFilters) {
      requestAnimationFrame(() => setDrawerOpen(true));
    }
  }, [showFilters]);

  const handleOpenFilters = () => {
    setShowFilters(true);
  };

  const handleCloseFilters = () => {
    setDrawerOpen(false);
    setTimeout(() => setShowFilters(false), 250);
  };

  const getSectionClasses = (isOpen: boolean, maxHeight: string) =>
    `transition-[max-height,opacity,transform] duration-300 ease-in-out overflow-hidden ${
      isOpen
        ? `${maxHeight} opacity-100 translate-y-0`
        : "max-h-0 opacity-0 -translate-y-1"
    }`;

  const colorOptions = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((product) => {
      const colorOption = product.variantOptions?.find(
        (opt) => opt.name === "Color",
      );
      (colorOption?.values || []).forEach((color) => {
        counts.set(color, (counts.get(color) || 0) + 1);
      });
    });
    return Array.from(counts.entries()).map(([value, count]) => ({
      value,
      count,
    }));
  }, [products]);

  const sizeOptions = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((product) => {
      const sizeOption = product.variantOptions?.find(
        (opt) => opt.name === "Size",
      );
      (sizeOption?.values || []).forEach((size) => {
        counts.set(size, (counts.get(size) || 0) + 1);
      });
    });
    return Array.from(counts.entries()).map(([value, count]) => ({
      value,
      count,
    }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const min = priceMin ? Number(priceMin) : undefined;
    const max = priceMax ? Number(priceMax) : undefined;

    return products.filter((product) => {
      if (!collectionSelected) return false;
      const price = product.price;
      if (min !== undefined && price < min) return false;
      if (max !== undefined && price > max) return false;

      const colorValues =
        product.variantOptions?.find((opt) => opt.name === "Color")?.values ||
        [];
      const sizeValues =
        product.variantOptions?.find((opt) => opt.name === "Size")?.values ||
        [];

      const matchesColor =
        selectedColors.length === 0 ||
        selectedColors.some((color) => colorValues.includes(color));
      const matchesSize =
        selectedSizes.length === 0 ||
        selectedSizes.some((size) => sizeValues.includes(size));

      return matchesColor && matchesSize;
    });
  }, [products, priceMin, priceMax, selectedColors, selectedSizes]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      case "featured":
        return sorted;
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Paginate products
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  const selectedChips = useMemo(() => {
    const chips: Array<{ key: string; label: string; onRemove: () => void }> =
      [];

    if (collectionSelected) {
      chips.push({
        key: "collection",
        label: `Loại sản phẩm: ${categoryName}`,
        onRemove: () => setCollectionSelected(false),
      });
    }

    selectedColors.forEach((color) => {
      chips.push({
        key: `color-${color}`,
        label: `Màu: ${color}`,
        onRemove: () =>
          setSelectedColors((prev) => prev.filter((item) => item !== color)),
      });
    });

    selectedSizes.forEach((size) => {
      chips.push({
        key: `size-${size}`,
        label: `Cỡ: ${size}`,
        onRemove: () =>
          setSelectedSizes((prev) => prev.filter((item) => item !== size)),
      });
    });

    if (priceMin || priceMax) {
      const minLabel = priceMin ? priceMin : "0";
      const maxLabel = priceMax ? priceMax : "Không giới hạn";
      chips.push({
        key: "price",
        label: `Giá: ₫${minLabel} - ₫${maxLabel}`,
        onRemove: () => {
          setPriceMin("");
          setPriceMax("");
        },
      });
    }

    return chips;
  }, [
    categoryName,
    collectionSelected,
    priceMax,
    priceMin,
    selectedColors,
    selectedSizes,
  ]);

  const hasActiveFilters =
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    Boolean(priceMin || priceMax) ||
    collectionSelected;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 ">
        <h1 className="text-base tracking-wide text-black">
          {categoryName} ({sortedProducts.length})
        </h1>
        <button
          onClick={handleOpenFilters}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-black text-black transition text-xs font-medium"
        >
          <SlidersHorizontal size={18} />
          <span>LỌC VÀ SẮP XẾP</span>
        </button>
      </div>

      {/* Filter/Sort Panel */}
      {showFilters && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
              drawerOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleCloseFilters}
          />
          <aside
            className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white text-black shadow-xl overflow-y-auto transition-transform duration-300 ease-out ${
              drawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-500">
                  {sortedProducts.length} sản phẩm
                </p>
                <p className="text-xs text-gray-500">Sắp xếp theo:</p>
              </div>
              <button
                onClick={handleCloseFilters}
                onMouseEnter={() => setIsCloseHover(true)}
                onMouseLeave={() => setIsCloseHover(false)}
                style={
                  isCloseHover
                    ? { animation: "scale-110 0.3s ease-out forwards" }
                    : { animation: "scale-110-reverse 0.3s ease-out forwards" }
                }
                className="h-10 w-10 bg-black border border-black flex items-center justify-center rounded-sm"
                aria-label="Đóng"
              >
                <span
                  style={
                    isCloseHover
                      ? {
                          animation: "spin-180 0.3s linear 1",
                          color: "white",
                        }
                      : {
                          animation: "spin-180-reverse 0.3s linear 1",
                          color: "white",
                        }
                  }
                  className="inline-block"
                >
                  ✕
                </span>
              </button>
            </div>

            {hasActiveFilters && (
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedChips.map((chip) => (
                      <button
                        key={chip.key}
                        onClick={chip.onRemove}
                        className="flex items-center gap-2 border border-black px-3 py-2 text-xs"
                      >
                        <span>{chip.label}</span>
                        <span className="text-base leading-none">×</span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setSortBy("default");
                      setCollectionSelected(true);
                      setSelectedColors([]);
                      setSelectedSizes([]);
                      setPriceMin("");
                      setPriceMax("");
                    }}
                    className="text-xs text-gray-500 hover:text-black"
                  >
                    Xóa hết
                  </button>
                </div>
              </div>
            )}

            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs">Sắp xếp theo</span>
                <button
                  onClick={() => setSortOpen((prev) => !prev)}
                  className="text-xl leading-none"
                  aria-label="Thu gọn sắp xếp"
                >
                  {sortOpen ? "−" : "+"}
                </button>
              </div>
              <div className={getSectionClasses(sortOpen, "max-h-40")}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                >
                  <option value="default">Bán chạy nhất</option>
                  <option value="featured">Nổi bật</option>
                  <option value="name-asc">Thứ tự bằng chữ cái (Từ A-Z)</option>
                  <option value="name-desc">
                    Thứ tự bằng chữ cái (Từ Z-A)
                  </option>
                  <option value="price-asc">Giá (Từ thấp đến cao)</option>
                  <option value="price-desc">Giá (Từ cao xuống thấp)</option>
                  <option value="newest">Ngày (Từ cũ đến mới)</option>
                  <option value="oldest">Ngày (Từ mới đến cũ)</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase">Bộ sưu tập</span>
                <button
                  onClick={() => setCollectionOpen((prev) => !prev)}
                  className="text-xl leading-none"
                  aria-label="Thu gọn bộ sưu tập"
                >
                  {collectionOpen ? "−" : "+"}
                </button>
              </div>
              <div className={getSectionClasses(collectionOpen, "max-h-24")}>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={collectionSelected}
                    onChange={(e) => setCollectionSelected(e.target.checked)}
                    className="h-5 w-5 border border-black accent-black rounded-none cursor-pointer"
                  />
                  {categoryName} ({products.length})
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs">Giá</span>
                <button
                  onClick={() => setPriceOpen((prev) => !prev)}
                  className="text-xl leading-none"
                  aria-label="Thu gọn giá"
                >
                  {priceOpen ? "−" : "+"}
                </button>
              </div>
              <div className={getSectionClasses(priceOpen, "max-h-48")}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="block text-xs text-gray-500 mb-1">Từ</span>
                    <div className="flex items-center border border-gray-300 px-3 py-2">
                      <span className="text-xs mr-2">₫</span>
                      <input
                        type="number"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        className="w-full text-xs focus:outline-none"
                        placeholder="0"
                        min={0}
                      />
                    </div>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 mb-1">
                      Đến
                    </span>
                    <div className="flex items-center border border-gray-300 px-3 py-2">
                      <span className="text-xs mr-2">₫</span>
                      <input
                        type="number"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="w-full text-xs focus:outline-none"
                        placeholder="340000"
                        min={0}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs">Màu</span>
                <button
                  onClick={() => setColorOpen((prev) => !prev)}
                  className="text-xl leading-none"
                  aria-label="Thu gọn màu"
                >
                  {colorOpen ? "−" : "+"}
                </button>
              </div>
              <div className={getSectionClasses(colorOpen, "max-h-60")}>
                <div className="space-y-2">
                  {colorOptions.map((color) => (
                    <label
                      key={color.value}
                      className="flex items-center gap-2 text-xs cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color.value)}
                        onChange={() =>
                          setSelectedColors((prev) =>
                            prev.includes(color.value)
                              ? prev.filter((item) => item !== color.value)
                              : [...prev, color.value],
                          )
                        }
                        className="h-5 w-5 border border-black accent-black rounded-none cursor-pointer"
                      />
                      {color.value} ({color.count})
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs">Cỡ</span>
                <button
                  onClick={() => setSizeOpen((prev) => !prev)}
                  className="text-xl leading-none"
                  aria-label="Thu gọn cỡ"
                >
                  {sizeOpen ? "−" : "+"}
                </button>
              </div>
              <div className={getSectionClasses(sizeOpen, "max-h-60")}>
                <div className="grid grid-cols-2 gap-2">
                  {sizeOptions.map((size) => (
                    <label
                      key={size.value}
                      className="flex items-center gap-2 text-xs cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size.value)}
                        onChange={() =>
                          setSelectedSizes((prev) =>
                            prev.includes(size.value)
                              ? prev.filter((item) => item !== size.value)
                              : [...prev, size.value],
                          )
                        }
                        className="h-5 w-5 border border-black accent-black rounded-none cursor-pointer"
                      />
                      {size.value} ({size.count})
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center justify-between">
              <button
                onClick={() => {
                  setSortBy("default");
                  setCollectionSelected(true);
                  setSelectedColors([]);
                  setSelectedSizes([]);
                  setPriceMin("");
                  setPriceMax("");
                }}
                className="text-xs underline hover:no-underline"
              >
                Xóa bộ lọc
              </button>
              <button
                onClick={handleCloseFilters}
                className="px-4 py-2 border border-black text-xs"
              >
                Xong
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Products Grid */}
      <CollectionGrid products={paginatedProducts} />

      {/* Pagination */}
      {totalPages > 1 && (
        <CollectionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          category={category}
        />
      )}
    </div>
  );
}
