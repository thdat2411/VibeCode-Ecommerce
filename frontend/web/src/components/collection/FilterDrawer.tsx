"use client";

import { Collection, Product } from "@/lib/api/catalog";

interface FilterChip {
  key: string;
  label: string;
  onRemove: () => void;
}

interface FilterDrawerProps {
  drawerOpen: boolean;
  onClose: () => void;
  // Sort
  sortBy: string;
  setSortBy: (v: string) => void;
  sortOpen: boolean;
  setSortOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  // Collection filter
  collectionOpen: boolean;
  setCollectionOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  collectionSelected: boolean;
  setCollectionSelected: (v: boolean) => void;
  subCollections: Collection[];
  selectedSubSlugs: string[];
  setSelectedSubSlugs: (v: string[] | ((prev: string[]) => string[])) => void;
  categoryName: string;
  products: Product[];
  // Price filter
  priceOpen: boolean;
  setPriceOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  priceMin: string;
  setPriceMin: (v: string) => void;
  priceMax: string;
  setPriceMax: (v: string) => void;
  // Color filter
  colorOpen: boolean;
  setColorOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  colorOptions: { value: string; count: number }[];
  selectedColors: string[];
  setSelectedColors: (v: string[] | ((prev: string[]) => string[])) => void;
  // Size filter
  sizeOpen: boolean;
  setSizeOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  sizeOptions: { value: string; count: number }[];
  selectedSizes: string[];
  setSelectedSizes: (v: string[] | ((prev: string[]) => string[])) => void;
  // Misc
  sortedProductCount: number;
  selectedChips: FilterChip[];
  hasActiveFilters: boolean;
  isCloseHover: boolean;
  setIsCloseHover: (v: boolean) => void;
  getSectionClasses: (isOpen: boolean, maxHeight: string) => string;
  onClearAll: () => void;
}

export function FilterDrawer({
  drawerOpen,
  onClose,
  sortBy,
  setSortBy,
  sortOpen,
  setSortOpen,
  collectionOpen,
  setCollectionOpen,
  collectionSelected,
  setCollectionSelected,
  subCollections,
  selectedSubSlugs,
  setSelectedSubSlugs,
  categoryName,
  products,
  priceOpen,
  setPriceOpen,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  colorOpen,
  setColorOpen,
  colorOptions,
  selectedColors,
  setSelectedColors,
  sizeOpen,
  setSizeOpen,
  sizeOptions,
  selectedSizes,
  setSelectedSizes,
  sortedProductCount,
  selectedChips,
  hasActiveFilters,
  isCloseHover,
  setIsCloseHover,
  getSectionClasses,
  onClearAll,
}: FilterDrawerProps) {
  return (
    <aside
      className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white text-black shadow-xl overflow-y-auto transition-transform duration-300 ease-out ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <p className="text-xs text-gray-500">{sortedProductCount} sản phẩm</p>
          <p className="text-xs text-gray-500">Sắp xếp theo:</p>
        </div>
        <button
          onClick={onClose}
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
                ? { animation: "spin-180 0.3s linear 1", color: "white" }
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

      {/* Active filter chips */}
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
              onClick={onClearAll}
              className="text-xs text-gray-500 hover:text-black"
            >
              Xóa hết
            </button>
          </div>
        </div>
      )}

      {/* Sort */}
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
            <option value="name-desc">Thứ tự bằng chữ cái (Từ Z-A)</option>
            <option value="price-asc">Giá (Từ thấp đến cao)</option>
            <option value="price-desc">Giá (Từ cao xuống thấp)</option>
            <option value="newest">Ngày (Từ cũ đến mới)</option>
            <option value="oldest">Ngày (Từ mới đến cũ)</option>
          </select>
        </div>
      </div>

      {/* Collection */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs">Bộ sưu tập</span>
          <button
            onClick={() => setCollectionOpen((prev) => !prev)}
            className="text-xl leading-none"
            aria-label="Thu gọn bộ sưu tập"
          >
            {collectionOpen ? "−" : "+"}
          </button>
        </div>
        <div className={getSectionClasses(collectionOpen, "max-h-60")}>
          {subCollections.length > 0 ? (
            <div className="space-y-2">
              {subCollections.map((sub) => {
                const count = products.filter(
                  (p) => p.collectionSlug === sub.slug,
                ).length;
                return (
                  <label
                    key={sub.id}
                    className="flex items-center gap-2 text-xs cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSubSlugs.includes(sub.slug)}
                      onChange={() =>
                        setSelectedSubSlugs((prev) =>
                          prev.includes(sub.slug)
                            ? prev.filter((s) => s !== sub.slug)
                            : [...prev, sub.slug],
                        )
                      }
                      className="h-5 w-5 border border-black accent-black rounded-none cursor-pointer"
                    />
                    {sub.name} ({count})
                  </label>
                );
              })}
            </div>
          ) : (
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={collectionSelected}
                onChange={(e) => setCollectionSelected(e.target.checked)}
                className="h-5 w-5 border border-black accent-black rounded-none cursor-pointer"
              />
              {categoryName} ({products.length})
            </label>
          )}
        </div>
      </div>

      {/* Price */}
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
              <span className="block text-xs text-gray-500 mb-1">Đến</span>
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

      {/* Color */}
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

      {/* Size */}
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

      {/* Footer */}
      <div className="px-6 py-4 flex items-center justify-between">
        <button
          onClick={onClearAll}
          className="text-xs underline hover:no-underline"
        >
          Xóa bộ lọc
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-black text-xs"
        >
          Xong
        </button>
      </div>
    </aside>
  );
}
