import { getCollectionProducts } from "@/lib/api/catalog";
import { CollectionWrapper } from "@/components/CollectionWrapper";
import { notFound } from "next/navigation";

interface CollectionPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
  }>;
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { category } = await params;
  const { page: pageStr, sort } = await searchParams;
  const page = parseInt(pageStr || "1");
  const sortBy = sort || "default";

  try {
    const { collection, products } = await getCollectionProducts(category);

    if (!collection) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-white" data-nav-theme="light">
        <main className="max-w-7xl px-4 sm:px-6 sm:pt-[20%] lg:px-8 lg:ml-[25%] lg:mr-[10%] lg:pt-[10%]">
          <CollectionWrapper
            category={category}
            categoryName={collection.name}
            products={products}
            currentPage={page}
            sortBy={sortBy}
          />
        </main>
      </div>
    );
  } catch (error) {
    console.error("Failed to load collection:", error);
    notFound();
  }
}

export const dynamic = "force-dynamic";
