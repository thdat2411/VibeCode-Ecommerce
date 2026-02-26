import { getProducts, getCollections } from "@/lib/api/catalog";
import { CatalogWrapper } from "@/components/CatalogWrapper";

// Disable static generation since we're fetching from API
export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const [products, collections] = await Promise.all([
    getProducts().catch(() => []),
    getCollections().catch(() => []),
  ]);

  return (
    <div className="min-h-screen bg-white" data-nav-theme="light">
      <main className="max-w-7xl px-4 sm:px-6 sm:pt-[20%] lg:px-8 lg:ml-[25%] lg:mr-[10%] lg:pt-[10%]">
        <div className="mb-8">
          <h1 className="text-xs font-bold tracking-widest uppercase text-black">
            Tất cả sản phẩm ({products.length})
          </h1>
        </div>
        <CatalogWrapper products={products} collections={collections} />
      </main>
    </div>
  );
}
