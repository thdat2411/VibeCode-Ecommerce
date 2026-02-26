"use client";

import { useState, useCallback, useMemo } from "react";
import { Product, Collection } from "@/lib/api/catalog";
import { CatalogFilters } from "./CatalogFilters";
import { CatalogResults } from "./CatalogResults";

interface CatalogWrapperProps {
  products: Product[];
  collections: Collection[];
}

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

export function CatalogWrapper({
  products: rawProducts,
  collections,
}: CatalogWrapperProps) {
  const products = useMemo(() => normalizeProducts(rawProducts), [rawProducts]);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  const handleFilter = useCallback((filtered: Product[]) => {
    setFilteredProducts(filtered);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 text-black">
      {/* Sidebar Filters */}
      <div className="lg:col-span-1">
        <div className="sticky top-20">
          <h2 className="text-xl font-bold mb-6">Filters</h2>
          <CatalogFilters
            products={products}
            collections={collections}
            onFilter={handleFilter}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="lg:col-span-3">
        <CatalogResults products={filteredProducts} />
      </div>
    </div>
  );
}
