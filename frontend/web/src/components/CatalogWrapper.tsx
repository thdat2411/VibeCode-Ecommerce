"use client";

import { useState } from "react";
import { Product } from "@/lib/api";
import { CatalogFilters } from "./CatalogFilters";
import { CatalogResults } from "./CatalogResults";

interface CatalogWrapperProps {
  products: Product[];
}

export function CatalogWrapper({ products }: CatalogWrapperProps) {
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
