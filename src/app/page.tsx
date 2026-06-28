import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StoreHeader from "@/components/store/header";
import StoreFooter from "@/components/store/footer";
import ProductCard from "@/components/store/product-card";
import { getProducts, getCategories } from "@/lib/db";

const categoryImages: Record<string, string> = {
  women: "/images/categories/women.svg",
  men: "/images/categories/men.svg",
  accessories: "/images/categories/accessories.svg",
  "new-arrivals": "/images/categories/new-arrivals.svg",
};

export default function Home() {
  const products = getProducts();
  const categories = getCategories();
  const featuredProducts = products.filter((p) => p.featured && p.active);

  return (
    <>
      <StoreHeader />
      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative bg-black text-white overflow-hidden" style={{ minHeight: "90vh" }}>
          <img
            src="/images/hero-bg.svg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

          <div className="relative h-full flex flex-col justify-end mx-auto max-w-7xl px-6 lg:px-12 pb-24 pt-40">
            <div className="max-w-xl">
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/50 mb-8">
                Collection — 2025
              </p>
              <h1 className="font-[family-name:var(--font-serif)] text-6xl sm:text-7xl lg:text-8xl font-light leading-[1.05] mb-8 italic">
                Effortless<br />
                <span className="not-italic font-medium">Elegance</span>
              </h1>
              <p className="text-sm font-light text-white/60 max-w-sm mb-12 leading-loose tracking-wide">
                Contemporary fashion crafted with premium materials and timeless design.
                Every piece tells a story of quality and sophistication.
              </p>
              <div className="flex items-center gap-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] font-light text-white border-b border-white pb-1 hover:opacity-60 transition-opacity duration-300"
                >
                  Discover the Collection <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
                </Link>
                <Link
                  href="/shop?category=new-arrivals"
                  className="text-[11px] uppercase tracking-[0.25em] font-light text-white/50 hover:text-white/80 transition-colors duration-300"
                >
                  New Arrivals
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Category Divider ─────────────────────────────── */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-neutral-200">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="group flex items-center justify-between px-6 py-5 hover:bg-neutral-50 transition-colors duration-200"
                >
                  <span className="text-[11px] uppercase tracking-[0.2em] font-light text-black">{cat.name}</span>
                  <ArrowRight className="h-3 w-3 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-200" strokeWidth={1.5} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Category Images ───────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-6 lg:px-12 py-24">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="font-[family-name:var(--font-serif)] text-3xl font-light italic text-black">
              Shop by Category
            </h2>
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">Four collections</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden bg-white"
              >
                <img
                  src={categoryImages[cat.slug] || categoryImages["new-arrivals"]}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/70 mb-1">{cat.description}</p>
                  <h3 className="text-base font-light uppercase tracking-[0.15em] text-white">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Featured Products ─────────────────────────────── */}
        <section className="border-t border-neutral-200 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="flex items-baseline justify-between mb-16">
              <h2 className="font-[family-name:var(--font-serif)] text-3xl font-light italic text-black">
                Featured Collection
              </h2>
              <Link
                href="/shop"
                className="text-[11px] uppercase tracking-[0.2em] font-light text-black border-b border-black pb-0.5 hover:opacity-50 transition-opacity duration-200"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Value Props ───────────────────────────────────── */}
        <section className="bg-neutral-50 border-t border-neutral-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-neutral-200">
              {[
                { title: "Complimentary Shipping", desc: "On orders over R1,500" },
                { title: "Secure Payment", desc: "Encrypted & protected" },
                { title: "30-Day Returns", desc: "Effortless exchanges" },
                { title: "Premium Craft", desc: "Finest materials, always" },
              ].map((item) => (
                <div key={item.title} className="py-10 px-8 text-center">
                  <h3 className="text-[11px] uppercase tracking-[0.2em] font-light text-black mb-2">{item.title}</h3>
                  <p className="text-xs text-neutral-400 font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Newsletter ────────────────────────────────────── */}
        <section className="bg-black text-white py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-12 text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/40 mb-6">Exclusive Access</p>
            <h2 className="font-[family-name:var(--font-serif)] text-4xl sm:text-5xl font-light italic mb-4">
              Stay in the Loop
            </h2>
            <p className="text-sm font-light text-white/50 mb-12 max-w-sm mx-auto leading-loose">
              Subscribe for exclusive offers, new arrivals, and style inspiration.
            </p>
            <form className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto border border-white/20">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-4 bg-transparent text-white text-sm font-light placeholder:text-white/30 focus:outline-none border-r border-white/20"
              />
              <button
                type="submit"
                className="px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-light text-black bg-white hover:bg-neutral-100 transition-colors duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

      </main>
      <StoreFooter />
    </>
  );
}
