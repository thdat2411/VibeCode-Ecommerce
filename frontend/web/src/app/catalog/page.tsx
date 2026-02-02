import { getProducts } from "@/lib/api";
import Link from "next/link";
import { CatalogWrapper } from "@/components/CatalogWrapper";

export default async function CatalogPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              The New Originals
            </Link>
            <nav className="space-x-6">
              <Link href="/catalog" className="hover:underline font-semibold">
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Shop All</h1>
          <p className="text-gray-600 mt-2">Discover our collection</p>
        </div>

        <CatalogWrapper products={products} />
      </main>

      <footer className="border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500">
          <p>&copy; 2026 The New Originals. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
