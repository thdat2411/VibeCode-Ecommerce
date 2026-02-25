"use client";

import { useState } from "react";
import { Product } from "@/lib/api/catalog";
import { CatalogFilters } from "./CatalogFilters";
import { CatalogResults } from "./CatalogResults";

interface CatalogWrapperProps {
  products: Product[];
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

export function CatalogWrapper({ products: rawProducts }: CatalogWrapperProps) {
  const products = normalizeProducts(rawProducts);

  // Debug logging
  if (typeof window !== "undefined") {
    console.log("CatalogWrapper received rawProducts:", rawProducts);
    console.log("CatalogWrapper normalized products:", products);
  }

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Filters */}
      <div className="lg:col-span-1">
        <div className="sticky top-20">
          <h2 className="text-xl font-bold mb-6">Filters</h2>
          <CatalogFilters products={products} onFilter={setFilteredProducts} />
        </div>
      </div>

      {/* Products Grid */}
      <div className="lg:col-span-3">
        <CatalogResults products={filteredProducts} />
      </div>
    </div>
  );
}
