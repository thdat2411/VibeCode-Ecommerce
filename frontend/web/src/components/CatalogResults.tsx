"use client";

import { Product } from "@/lib/api/catalog";
import Image from "next/image";
import Link from "next/link";

interface CatalogResultsProps {
  products: Product[];
  isLoading?: boolean;
}

export function CatalogResults({ products, isLoading }: CatalogResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded mb-4" />
            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
            <div className="h-4 bg-gray-200 rounded mb-4 w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found.</p>
        <p className="text-gray-400 text-sm mt-2">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-600 mb-6">
        Showing {products.length} product{products.length !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/catalog/${product.id}`}
            className="group"
          >
            <div className="aspect-square relative mb-4 bg-gray-100 overflow-hidden rounded-lg">
              <Image
                src={product.thumbnailImage}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
            </div>
            <h3 className="font-semibold mb-1 group-hover:underline">
              {product.name}
            </h3>
            <p className="font-bold">
              ₫{product.price.toLocaleString("vi-VN")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
