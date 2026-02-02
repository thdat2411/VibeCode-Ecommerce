import React from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  image2?: string;
  colors: string[];
  isOnSale?: boolean;
  saleLabel?: string;
}

// Sample product data
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "OVERSIZE CREW NECK TEE",
    brand: "THE NEW ORIGINALS",
    price: 159000,
    compareAtPrice: 219000,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop",
    image2:
      "https://images.unsplash.com/photo-1554062407-98eeb440d6a1?w=500&h=600&fit=crop",
    colors: ["Đen", "Trắng", "Navy"],
    isOnSale: true,
    saleLabel: "ĐANG GIẢM GIÁ",
  },
  {
    id: "2",
    name: "PREMIUM LONG SLEEVE TEE",
    brand: "THE NEW ORIGINALS",
    price: 199000,
    image:
      "https://images.unsplash.com/photo-1578932750294-708d6bf808d4?w=500&h=600&fit=crop",
    image2:
      "https://images.unsplash.com/photo-1578932750294-708d6bf808d4?w=500&h=600&fit=crop",
    colors: ["Đen", "Kem"],
    isOnSale: false,
  },
  {
    id: "3",
    name: "COMFORT HOODIE",
    brand: "THE NEW ORIGINALS",
    price: 318000,
    compareAtPrice: 398000,
    image:
      "https://theneworiginals.co/cdn/shop/files/Tr_ngsau_7527904e-3d87-4615-8f87-8fc6e8c393b3.png?v=1768551275&width=375",
    image2:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=600&fit=crop",
    colors: ["Đen", "Navy", "Xám"],
    isOnSale: true,
    saleLabel: "ĐANG GIẢM GIÁ",
  },
  {
    id: "4",
    name: "URBAN SWEATER KNIT",
    brand: "THE NEW ORIGINALS",
    price: 399000,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop",
    image2:
      "https://images.unsplash.com/photo-1552062407-c551eeda4bbb?w=500&h=600&fit=crop",
    colors: ["Trắng", "Kem", "Navy"],
    isOnSale: false,
  },
  {
    id: "5",
    name: "OVERSIZED GRAPHIC TEE",
    brand: "THE NEW ORIGINALS",
    price: 179000,
    compareAtPrice: 249000,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3dd43?w=500&h=600&fit=crop",
    image2:
      "https://images.unsplash.com/photo-1505587273575-bc986d1eda00?w=500&h=600&fit=crop",
    colors: ["Đen", "Trắng"],
    isOnSale: true,
    saleLabel: "100K OFF",
  },
  {
    id: "6",
    name: "COZY FLEECE JACKET",
    brand: "THE NEW ORIGINALS",
    price: 598000,
    compareAtPrice: 798000,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=600&fit=crop",
    image2:
      "https://images.unsplash.com/photo-1548126328-c9fa89d128fa?w=500&h=600&fit=crop",
    colors: ["Đen", "Navy"],
    isOnSale: true,
    saleLabel: "SALE",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="min-h-screen md:ml-48 md:w-[calc(100%-12rem)]">
        {/* Hero Section */}
        <section
          className="relative min-h-screen text-white"
          data-hero
          data-nav-theme="dark"
        >
          <div className="absolute inset-0">
            <img
              src="https://theneworiginals.co/cdn/shop/files/z7346120636162_bb2dd60e129a70d94cf05c3750fa67b3.jpg?v=1766204550&width=2200"
              alt="The New Originals hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
          </div>

          <div className="absolute top-8 left-6 md:left-56 z-40">
            <Link
              href="/"
              className="text-2xl font-semibold tracking-wide drop-shadow"
            >
              the new
              <br />
              originals
            </Link>
          </div>

          <div className="absolute bottom-10 left-6 md:left-56 z-40 max-w-xl">
            <h2 className="text-4xl lg:text-6xl font-semibold mb-6 tracking-tight">
              BE BOLD. BE NEW. BE ORIGINAL
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/catalog"
                className="inline-block bg-white text-black px-10 py-3 rounded-sm font-semibold hover:bg-gray-200 transition text-sm tracking-widest"
              >
                KHÁM PHÁ
              </Link>
            </div>
          </div>
        </section>

        {/* Trending Products Section */}
        <section className="py-16 lg:py-24" data-nav-theme="light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold text-center mb-2">
                ĐANG BÁN CHẠY
              </h3>
              <p className="text-center text-gray-600">
                Những sản phẩm được yêu thích nhất hiện nay
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {sampleProducts.slice(0, 3).map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        {/* Signature Relaxed Fit Section */}
        <section className="py-16 lg:py-24" data-nav-theme="light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="order-2 lg:order-1">
                <p className="text-xs tracking-[0.25em] text-gray-500 uppercase mb-3">
                  Define your style
                </p>
                <h3 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
                  SIGNATURE RELAXED
                  <br />
                  FIT
                </h3>
                <button className="border border-black px-6 py-2 text-sm tracking-widest font-semibold hover:bg-black hover:text-white transition">
                  KHÁM PHÁ NGAY!
                </button>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {sampleProducts.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="relative lg:sticky lg:top-1/2 lg:-translate-y-1/2">
                  <img
                    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&h=1100&fit=crop"
                    alt="Signature relaxed fit"
                    className="w-full h-auto rounded-sm object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Collections Carousel Section */}
        <section className="py-16 lg:py-24" data-nav-theme="light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold text-center mb-2">
                CÁC BST BẠN CÓ THỂ THÍCH
              </h3>
              <p className="text-center text-gray-600">
                Những bộ sưu tập được chọn lọc đặc biệt
              </p>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
              {sampleProducts.concat(sampleProducts).map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="min-w-[240px] sm:min-w-[260px] lg:min-w-[280px] snap-start"
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pure Comfort Section */}
        <section className="py-16 lg:py-24 bg-gray-50" data-nav-theme="light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="order-2">
                <p className="text-xs tracking-[0.25em] text-gray-500 uppercase mb-3">
                  Pure comfort
                </p>
                <h3 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
                  THE NEW ERA OF
                  <br />
                  HOODIE
                </h3>
                <button className="border border-black px-6 py-2 text-sm tracking-widest font-semibold hover:bg-black hover:text-white transition">
                  KHÁM PHÁ NGAY!
                </button>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {sampleProducts.slice(2, 6).map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </div>

              <div className="order-1">
                <div className="relative lg:sticky lg:top-1/2 lg:-translate-y-1/2">
                  <img
                    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&h=1100&fit=crop"
                    alt="Pure comfort"
                    className="w-full h-auto rounded-sm object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cozy Season Sweaters Section */}
        <section className="py-16 lg:py-24" data-nav-theme="light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold text-center mb-2">
                COZY SEASON
              </h3>
              <p className="text-center text-gray-600">
                Những chiếc áo len ấm áp cho ngày lạnh
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {sampleProducts.slice(0, 3).map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section
          className="py-16 lg:py-24 bg-black text-white"
          data-nav-theme="dark"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                CẬP NHẬT NHỮNG SẢN PHẨM MỚI NHẤT
              </h3>
              <p className="text-lg text-gray-300 mb-8">
                Đăng ký nhận thông báo về những bộ sưu tập mới, ưu đãi độc quyền
                và sự kiện đặc biệt
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="flex-1 px-4 py-3 rounded-sm text-black placeholder-gray-400 focus:outline-none"
                />
                <button className="bg-white text-black px-8 py-3 rounded-sm font-semibold hover:bg-gray-200 transition tracking-wide">
                  ĐĂNG KÝ
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24 bg-gray-50" data-nav-theme="light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="text-5xl mb-4">🚚</div>
                <h4 className="text-xl font-bold mb-3">GIAO HÀNG NHANH</h4>
                <p className="text-gray-600">
                  Giao hàng nhanh chóng và an toàn đến tận tay bạn
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">✓</div>
                <h4 className="text-xl font-bold mb-3">CHẤT LƯỢNG CAO</h4>
                <p className="text-gray-600">
                  Nguyên liệu cao cấp và kỹ thuật chế tác tuyệt vời
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">💬</div>
                <h4 className="text-xl font-bold mb-3">HỖNG TRỢ KHÁCH HÀNG</h4>
                <p className="text-gray-600">
                  Luôn sẵn sàng giúp đỡ bạn với bất kỳ câu hỏi nào
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
