"use client";

import { getProductById } from "@/lib/api/catalog";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState, useEffect, use } from "react";
import { AddToCartForm } from "@/components/AddToCartForm";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(id)
      .then(setProduct)
      .catch(() => notFound())
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  const sizes = product.variants["Size"] || [];
  const colors = product.variants["Color"] || [];

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              The New Originals
            </Link>
            <nav className="space-x-6">
              <Link href="/catalog" className="hover:underline">
                Shop
              </Link>
              <Link href="/cart" className="hover:underline">
                Cart
              </Link>
              <Link href="/auth/signin" className="hover:underline">
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/catalog"
          className="text-sm hover:underline mb-8 inline-block"
        >
          ← Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {product.images.map((image: string, idx: number) => (
              <div key={idx} className="aspect-square relative bg-gray-100">
                <Image
                  src={image}
                  alt={`${product.name} - Image ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>

          {/* Product Details */}
          <div className="sticky top-8 h-fit">
            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl font-bold mb-6">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-gray-700 mb-8 leading-relaxed">
              {product.description}
            </p>

            <AddToCartForm product={product} sizes={sizes} colors={colors} />
          </div>
        </div>
      </main>

      <footer className="border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500">
          <p>&copy; 2026 The New Originals. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
