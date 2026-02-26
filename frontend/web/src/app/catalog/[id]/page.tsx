"use client";

import { getProductById } from "@/lib/api/catalog";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { AddToCartForm } from "@/components/AddToCartForm";
import { ImageGallery } from "@/components/ImageGallery";
import { ColorSelector } from "@/components/ColorSelector";
import { ProductHighlights } from "@/components/ProductHighlights";
import { ProductDescription } from "@/components/ProductDescription";
import { Heart, Share2, Facebook, Twitter } from "lucide-react";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedColorImages, setSelectedColorImages] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    care: true,
    shipping: false,
    returns: false,
  });

  useEffect(() => {
    if (!id) return;

    getProductById(id)
      .then((p) => {
        console.log(p);
        if (!p || !p.id) {
          setError("Product not found");
          return;
        }
        setProduct(p);
        // Set initial color
        const colorOption = p.variantOptions?.find(
          (opt: any) => opt.name === "Color",
        );
        if (colorOption?.values && colorOption.values.length > 0) {
          setSelectedColor(colorOption.values[0]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        setError(err.message || "Failed to load product");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Update images when color changes
  useEffect(() => {
    if (product && selectedColor) {
      const colorImages = product.variantImages?.filter(
        (vi: any) =>
          vi.variantType === "Color" && vi.variantValue === selectedColor,
      );
      if (colorImages && colorImages.length > 0) {
        setSelectedColorImages(colorImages[0].images || []);
      } else {
        // Fallback to first image if no color-specific images
        setSelectedColorImages(
          product.thumbnailImage ? [product.thumbnailImage] : [],
        );
      }
    }
  }, [product, selectedColor]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black">
        <div className="text-center">
          <p className="text-lg  mb-2">Product Not Found</p>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <Link href="/catalog" className="text-blue-600 hover:underline">
            ← Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const colorOption = product?.variantOptions?.find(
    (opt: any) => opt.name === "Color",
  );
  const sizeOption = product?.variantOptions?.find(
    (opt: any) => opt.name === "Size",
  );

  const colors = colorOption?.values || [];
  const sizes = sizeOption?.values || [];

  // Build color options with thumbnails
  const colorOptionsWithThumbnails = (colors || []).map((color: string) => {
    const colorImage = product?.variantImages?.find(
      (vi: any) => vi.variantType === "Color" && vi.variantValue === color,
    );
    return {
      name: color,
      thumbnail: colorImage?.images?.[0] || product?.thumbnailImage || "",
      isAvailable: true,
    };
  });

  // Price display with sale formatting
  const displayPrice = product?.price || 0;
  const isOnSale =
    product?.compareAtPrice && product?.compareAtPrice > product?.price;
  const compareAtPrice = product?.compareAtPrice || product?.price || 0;

  return (
    <div className="min-h-screen bg-white text-black" data-nav-theme="light">
      <main className="max-w-7xl px-4 sm:px-6 lg:px-8 lg:ml-[25%] lg:mr-[10%] lg:pt-[10%]">
        <Link
          href="/catalog"
          className="text-xs hover:underline mb-8 inline-block text-gray-600"
        >
          ← Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images Gallery */}
          <div>
            <ImageGallery
              images={selectedColorImages}
              productName={product.name}
            />

            {/* Product Highlights Section */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="mt-12">
                <ProductHighlights highlights={product.highlights} />
              </div>
            )}
          </div>

          {/* Product Details Panel */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            {/* Header Section */}
            <div className="mb-6">
              <p className="text-xs text-gray-600 mb-2 uppercase tracking-widest">
                {product.collectionSlug?.replace(/-/g, " ") || "Product"}
              </p>
              <h1 className="text-lg lg:text-xl  mb-4">
                {(product.name || "Untitled Product").toUpperCase()}
              </h1>

              {/* Price Section */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-base lg:text-lg ">
                  {displayPrice.toLocaleString("vi-VN")}₫
                </span>
                {isOnSale && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      {compareAtPrice.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs ">
                      SALE
                    </span>
                  </>
                )}
              </div>

              {/* SKU */}
              {product.sku && (
                <p className="text-xs text-gray-600">SKU: {product.sku}</p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-b py-6">
              {/* Color Selector */}
              {colors.length > 0 && (
                <ColorSelector
                  colors={colorOptionsWithThumbnails}
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                />
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mt-6">
              <AddToCartForm
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  totalStock: product.totalStock ?? 0,
                  images: selectedColorImages,
                }}
                sizes={sizes}
                colors={colors}
              />
            </div>

            {/* Social and Wishlist */}
            <div className="mt-6 flex items-center flex-col gap-4 border-t pt-6">
              <div className="flex gap-2 ml-auto">
                <a
                  href="#"
                  className="hover:underline"
                  title="Share on Facebook"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="#"
                  className="hover:underline"
                  title="Share on Twitter"
                >
                  <Twitter size={16} />
                </a>
              </div>
              <Image
                src="https://theneworiginals.co/cdn/shop/files/1b14bec04a8ec5d09c9f.jpg?v=1765527597&width=750"
                alt=""
                width={850}
                height={850}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Care Instructions Section - Accordion */}
        <div className="border-t mt-4">
          {/* Product Details Section */}
          <ProductDescription
            sku={product.sku}
            shortDescription={product.shortDescription}
            longDescription={product.description}
            specifications={product.specifications}
          />
          <button
            onClick={() =>
              setExpandedSections((prev) => ({
                ...prev,
                care: !prev.care,
              }))
            }
            className="w-full flex items-center justify-between py-6"
          >
            <h2 className="text-lg ">BẢO QUẢN</h2>
            <span className="text-2xl">
              {expandedSections.care ? "−" : "+"}
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expandedSections.care ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="pb-6 border-t">
              <p className="mb-4 leading-relaxed text-sm mt-4">
                Để bảo quản sản phẩm đúng cách, luôn mới và bền đẹp thì bạn nên
                giặt ở nhiệt độ thấp, sử dụng các chế độ vắt nhẹ nhàng sẽ có lợi
                hơn cho sản phẩm, giúp duy trì màu sắc, hình dạng và cấu trúc
                của vải.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Không sử dụng nước tẩy / thuốc tẩy</li>
                <li>• Lộn trái sản phẩm khi giặt và phơi</li>
                <li>• Tránh phơi dưới ánh nắng trực tiếp</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Shipping Section - Accordion */}
        <div className="border-t">
          <button
            onClick={() =>
              setExpandedSections((prev) => ({
                ...prev,
                shipping: !prev.shipping,
              }))
            }
            className="w-full flex items-center justify-between py-6"
          >
            <h2 className="text-lg ">CHÍNH SÁCH GIAO HÀNG</h2>
            <span className="text-2xl">
              {expandedSections.shipping ? "−" : "+"}
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expandedSections.shipping ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="pb-6 border-t">
              <p className="mb-4 leading-relaxed text-sm mt-4">
                Giao hàng nhanh toàn quốc từ 1-5 ngày tùy khu vực.
              </p>
              <Link
                href="#"
                className="text-sm hover:underline text-gray-600 underline"
              >
                Xem thêm chính sách giao hàng
              </Link>
            </div>
          </div>
        </div>

        {/* Returns Section - Accordion */}
        <div className="border-t pb-12">
          <button
            onClick={() =>
              setExpandedSections((prev) => ({
                ...prev,
                returns: !prev.returns,
              }))
            }
            className="w-full flex items-center justify-between py-6"
          >
            <h2 className="text-lg ">CHÍNH SÁCH ĐỔI TRẢ & BẢO HÀNH</h2>
            <span className="text-2xl">
              {expandedSections.returns ? "−" : "+"}
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expandedSections.returns ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="pb-6 border-t">
              <p className="mb-4 leading-relaxed text-sm mt-4">
                Nhằm mang lại cho bạn sự tiện lợi và những trải nghiệm tuyệt vời
                khi mua hàng, chúng tôi đã phát triển dịch vụ đổi hàng tận nơi
                và chính sách bảo hành.
              </p>
              <Link
                href="#"
                className="text-sm hover:underline text-gray-600 underline"
              >
                Xem thêm chính sách đổi trả & bảo hành
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
