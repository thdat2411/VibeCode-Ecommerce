"use client";

import { useState, useMemo, useEffect } from "react";
import { Product, Collection } from "@/lib/api/catalog";
import { CollectionGrid } from "./CollectionGrid";
import { CollectionPagination } from "./CollectionPagination";
import { FilterDrawer } from "@/components/collection/FilterDrawer";
import { SlidersHorizontal } from "lucide-react";

interface CollectionWrapperProps {
  category: string;
  categoryName: string;
  subCollections: Collection[];
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
  subCollections,
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

  // Notify Header to re-sample nav theme once client content is mounted.
  useEffect(() => {
    window.dispatchEvent(new Event("dataLoadComplete"));
  }, []);

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
  // Sub-collection filter: empty = show all sub-collections
  const [selectedSubSlugs, setSelectedSubSlugs] = useState<string[]>([]);

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

      // Sub-collection filter
      if (
        selectedSubSlugs.length > 0 &&
        !selectedSubSlugs.includes(product.collectionSlug)
      )
        return false;

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
  }, [
    products,
    priceMin,
    priceMax,
    selectedColors,
    selectedSizes,
    selectedSubSlugs,
    collectionSelected,
  ]);

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

    selectedSubSlugs.forEach((slug) => {
      const sub = subCollections.find((s) => s.slug === slug);
      if (sub) {
        chips.push({
          key: `sub-${slug}`,
          label: `Bộ sưu tập: ${sub.name}`,
          onRemove: () =>
            setSelectedSubSlugs((prev) => prev.filter((s) => s !== slug)),
        });
      }
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
    selectedSubSlugs,
    subCollections,
  ]);

  const hasActiveFilters =
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    Boolean(priceMin || priceMax) ||
    selectedSubSlugs.length > 0 ||
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
          <FilterDrawer
            drawerOpen={drawerOpen}
            onClose={handleCloseFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOpen={sortOpen}
            setSortOpen={setSortOpen}
            collectionOpen={collectionOpen}
            setCollectionOpen={setCollectionOpen}
            collectionSelected={collectionSelected}
            setCollectionSelected={setCollectionSelected}
            subCollections={subCollections}
            selectedSubSlugs={selectedSubSlugs}
            setSelectedSubSlugs={setSelectedSubSlugs}
            categoryName={categoryName}
            products={products}
            priceOpen={priceOpen}
            setPriceOpen={setPriceOpen}
            priceMin={priceMin}
            setPriceMin={setPriceMin}
            priceMax={priceMax}
            setPriceMax={setPriceMax}
            colorOpen={colorOpen}
            setColorOpen={setColorOpen}
            colorOptions={colorOptions}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            sizeOpen={sizeOpen}
            setSizeOpen={setSizeOpen}
            sizeOptions={sizeOptions}
            selectedSizes={selectedSizes}
            setSelectedSizes={setSelectedSizes}
            sortedProductCount={sortedProducts.length}
            selectedChips={selectedChips}
            hasActiveFilters={hasActiveFilters}
            isCloseHover={isCloseHover}
            setIsCloseHover={setIsCloseHover}
            getSectionClasses={getSectionClasses}
            onClearAll={() => {
              setSortBy("default");
              setCollectionSelected(true);
              setSelectedColors([]);
              setSelectedSizes([]);
              setSelectedSubSlugs([]);
              setPriceMin("");
              setPriceMax("");
            }}
          />

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
