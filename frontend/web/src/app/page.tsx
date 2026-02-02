"use client";

import React, { useRef, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
      "https://theneworiginals.co/cdn/shop/files/Tr_ngsau_7527904e-3d87-4615-8f87-8fc6e8c393b3.png?v=1768551275&width=375",
    image2:
      "https://theneworiginals.co/cdn/shop/files/tr_ngtay_29f05012-a736-486c-8da8-6f69d6bb8f02.png?v=1768618197&width=375",
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
      "https://theneworiginals.co/cdn/shop/files/densau_016cde8b-bfd3-4e3d-b677-2bf7872ddf0e.png?v=1768287832&width=375",
    image2:
      "https://theneworiginals.co/cdn/shop/files/dentr_c_aafbc2dc-ba9f-4111-a1e2-6572171f949a.png?v=1768287832&width=375",
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
      "https://theneworiginals.co/cdn/shop/files/kemtr_c_9ca3c1d2-42ce-4598-8156-ff18ede2899d.png?v=1768286958&width=375",
    image2:
      "https://theneworiginals.co/cdn/shop/files/kemtay_ed73993f-faa9-404f-a654-47c41ea5aa21.png?v=1768286958&width=375",
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
      "https://theneworiginals.co/cdn/shop/files/Kemsau_19d12557-30be-44b2-b180-9c74a003d0a4.png?v=1768031885&width=375",
    image2:
      "https://theneworiginals.co/cdn/shop/files/kemtr_c_f362fcf1-9681-42d0-a3ae-07c546403d4a.png?v=1768031997&width=375",
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
  const [carouselScroll, setCarouselScroll] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Detect mobile/tablet screen size
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollCarousel = useCallback(
    (direction: "left" | "right") => {
      if (carouselRef.current) {
        const scrollAmount = 300;
        const newScroll =
          carouselScroll +
          (direction === "right" ? scrollAmount : -scrollAmount);
        carouselRef.current.scrollLeft = newScroll;
        setCarouselScroll(newScroll);
      }
    },
    [carouselScroll],
  );

  // Determine number of products to display
  const displayedProducts = isMobile ? 2 : 4;
  return (
    <div className="min-h-screen bg-white">
      <main className="min-h-screen">
        {/* Hero Section */}
        <section
          className="relative min-h-screen text-white"
          data-hero
          data-nav-theme="dark"
        >
          <div className="absolute inset-0 overflow-hidden">
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
        <section className="py-16 lg:pb-10" data-nav-theme="light">
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 md:ml-[25%]">
            {/* Featured Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
              <div className="flex flex-col justify-center">
                <p className="text-xs tracking-[0.25em] text-black uppercase mb-4">
                  Brand new product
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-6 sm:mb-8 text-black">
                  URBAN LONG-SLEEVES
                </h2>
                <Link
                  href="/catalog"
                  className="inline-block w-fit bg-black text-white px-6 sm:px-8 py-2 sm:py-3 font-semibold hover:bg-gray-800 transition text-xs sm:text-sm tracking-[0.15em] uppercase"
                >
                  KHÁM PHÁ NGAY!
                </Link>
              </div>
              <div className="relative h-30 sm:h-48 lg:h-full">
                <img
                  src="https://theneworiginals.co/cdn/shop/files/z7342701668529_4fa1b8dada9b259e5ac87925d3801c9b.jpg?v=1766118493&width=550"
                  alt="Featured Urban Long-Sleeves"
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>
            </div>

            {/* Carousel Section */}
            <div className="relative">
              <div
                ref={carouselRef}
                className="flex gap-4 pb-8 snap-x snap-mandatory scroll-smooth w-full"
                style={{
                  scrollBehavior: "smooth",
                  overflowX: "auto",
                }}
              >
                {sampleProducts.slice(0, displayedProducts).map((product) => (
                  <div
                    key={`trending-${product.id}`}
                    className="snap-start flex-shrink-0"
                    style={{
                      width: isMobile ? "calc(50% - 8px)" : "calc(25% - 12px)",
                    }}
                  >
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <div className="flex justify-center gap-6">
                <button
                  onClick={() => scrollCarousel("left")}
                  className="bg-gray-300 hover:bg-gray-400 p-2 rounded-full transition"
                  aria-label="Previous products"
                >
                  <ChevronLeft size={24} className="text-gray-600" />
                </button>
                <button
                  onClick={() => scrollCarousel("right")}
                  className="bg-gray-300 hover:bg-gray-400 p-2 rounded-full transition"
                  aria-label="Next products"
                >
                  <ChevronRight size={24} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Signature Relaxed Fit Section */}
        <section data-nav-theme="light">
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 md:ml-[25%]">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="order-2 lg:order-1">
                <p className="text-xs tracking-[0.25em] text-gray-500 uppercase mb-3">
                  Define your style
                </p>
                <h3 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-6 text-black">
                  SIGNATURE RELAXED
                  <br />
                  FIT
                </h3>
                <button className="border border-black text-black px-6 py-2 text-sm tracking-widest font-semibold hover:bg-black hover:text-white transition">
                  KHÁM PHÁ NGAY!
                </button>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {sampleProducts.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="relative lg:sticky lg:top-24">
                  <img
                    src="https://theneworiginals.co/cdn/shop/files/banner_d_c_ko_logo.png?v=1744450616&width=750"
                    alt="Signature relaxed fit"
                    className="w-full h-auto rounded-sm object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Collections Section - Design Layout */}
        <section className="py-12 sm:py-16 lg:py-20" data-nav-theme="light">
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 md:ml-[25%]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Column - Dark Background with Product Info */}
              <div className="bg-black text-white overflow-hidden flex flex-col justify-between items-center py-12 px-6">
                {/* Product Image Container */}
                <div className="flex items-center justify-center">
                  <div className="w-56 sm:w-64 lg:w-72 h-56 sm:h-64 lg:h-72 overflow-hidden rounded-lg flex items-center justify-center bg-gray-800">
                    <img
                      src="https://theneworiginals.co/cdn/shop/files/z7342613879524_4ace45cddc4e071112770f6ea3bc67b0.jpg?v=1766117523&width=550"
                      alt="Product showcase"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="text-center">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 tracking-tight">
                    Soft Routine
                  </h3>
                  <button className="bg-white text-black px-8 sm:px-10 py-3 sm:py-4 font-semibold hover:bg-gray-100 transition text-sm sm:text-base tracking-widest">
                    MUA NGAY!
                  </button>
                </div>
              </div>

              {/* Right Column - Lifestyle Image */}
              <div className="overflow-hidden min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
                <img
                  src="https://theneworiginals.co/cdn/shop/files/z7342613850866_e9cd1f85c562f946311fc4bb272ef69b.jpg?v=1766117231&width=750"
                  alt="Lifestyle"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pure Comfort Section */}
        <section className="bg-gray-50" data-nav-theme="light">
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 md:ml-[25%]">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="order-2">
                <p className="text-xs tracking-[0.25em] text-gray-500 uppercase mb-3">
                  Pure comfort
                </p>
                <h3 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-6 text-black">
                  THE NEW ERA OF
                  <br />
                  HOODIE
                </h3>
                <button className="border text-black border-black px-6 py-2 text-sm tracking-widest font-semibold hover:bg-black hover:text-white transition">
                  KHÁM PHÁ NGAY!
                </button>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {sampleProducts.slice(2, 6).map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </div>

              <div className="order-1">
                <div className="relative lg:sticky lg:top-24">
                  <img
                    src="http://theneworiginals.co/cdn/shop/files/Banners_1_aa4fce64-ce96-479f-a04d-05c1bd965e99.png?v=1766111730&width=750"
                    alt="Pure comfort"
                    className="w-[90%] h-auto rounded-sm object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cozy Season Sweaters Section */}
        <section className="py-16 lg:py-24" data-nav-theme="light">
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 md:ml-[25%]">
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
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 md:ml-[25%]">
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
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 md:ml-[25%]">
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
