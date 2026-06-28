import { Suspense } from "react";
import ProductCard from "@/components/store/product-card";
import ShopSearch from "@/components/store/shop-search";
import { getProducts, getCategories } from "@/lib/db";
import Link from "next/link";

export const metadata = {
  title: "Shop | Renéri Couture",
  description: "Browse our full collection of premium clothing and accessories.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; min?: string; max?: string }>;
}) {
  const params = await searchParams;
  const allProducts = getProducts().filter((p) => p.active);
  const categories = getCategories();

  let products = allProducts;
  let activeCategory = "all";

  if (params.category) {
    activeCategory = params.category;
    const cat = categories.find((c) => c.slug === params.category);
    if (cat) {
      products = allProducts.filter(
        (p) => p.category.toLowerCase() === cat.name.toLowerCase()
      );
    }
  }

  if (params.q) {
    const query = params.q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query)) ||
        p.colors.some((c) => c.toLowerCase().includes(query))
    );
  }

  if (params.min) {
    const min = parseFloat(params.min);
    if (!isNaN(min)) products = products.filter((p) => p.price >= min);
  }

  if (params.max) {
    const max = parseFloat(params.max);
    if (!isNaN(max)) products = products.filter((p) => p.price <= max);
  }

  const activePriceRange = params.min || params.max
    ? params.min && params.max
      ? `R${Number(params.min).toLocaleString()} – R${Number(params.max).toLocaleString()}`
      : params.min
      ? `Over R${Number(params.min).toLocaleString()}`
      : `Under R${Number(params.max).toLocaleString()}`
    : null;

  const activeLabel = params.category
    ? categories.find((c) => c.slug === params.category)?.name ?? "Shop"
    : params.q
    ? `Results for "${params.q}"`
    : activePriceRange
    ? activePriceRange
    : "All Products";

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12">
      {/* Page header */}
      <div className="border-b border-neutral-200 py-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-2">The Collection</p>
          <h1 className="font-[family-name:var(--font-serif)] text-3xl font-light italic text-black">
            {activeLabel}
          </h1>
          <p className="text-xs font-light text-neutral-400 mt-2 tracking-wide">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
        </div>
        <Suspense fallback={null}>
          <ShopSearch />
        </Suspense>
      </div>

      <div className="flex gap-12 py-12">
        {/* Sidebar */}
        <aside className="hidden lg:block w-44 flex-shrink-0">
          <div className="sticky top-28 space-y-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] font-light text-black mb-5">
                Category
              </p>
              <nav className="space-y-3.5">
                <Link
                  href="/shop"
                  className={`block text-xs font-light tracking-wide transition-colors duration-200 ${
                    activeCategory === "all"
                      ? "text-black border-b border-black pb-0.5"
                      : "text-neutral-400 hover:text-black"
                  }`}
                >
                  All Products
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    className={`block text-xs font-light tracking-wide transition-colors duration-200 ${
                      activeCategory === cat.slug
                        ? "text-black border-b border-black pb-0.5"
                        : "text-neutral-400 hover:text-black"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="border-t border-neutral-200 pt-8">
              <p className="text-[10px] uppercase tracking-[0.25em] font-light text-black mb-5">
                Price
              </p>
              <div className="space-y-3.5">
                {[
                  { label: "Under R1,000", min: undefined, max: "1000" },
                  { label: "R1,000 – R2,500", min: "1000", max: "2500" },
                  { label: "R2,500 – R5,000", min: "2500", max: "5000" },
                  { label: "Over R5,000", min: "5000", max: undefined },
                ].map((r) => {
                  const isActive = params.min === r.min && params.max === r.max;
                  const qs = new URLSearchParams();
                  if (params.category) qs.set("category", params.category);
                  if (r.min) qs.set("min", r.min);
                  if (r.max) qs.set("max", r.max);
                  return (
                    <Link
                      key={r.label}
                      href={`/shop?${qs.toString()}`}
                      className={`block text-xs font-light tracking-wide transition-colors duration-200 ${
                        isActive
                          ? "text-black border-b border-black pb-0.5"
                          : "text-neutral-400 hover:text-black"
                      }`}
                    >
                      {r.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-32">
              <p className="font-[family-name:var(--font-serif)] text-2xl font-light italic text-neutral-400 mb-4">
                No pieces found
              </p>
              <p className="text-xs font-light text-neutral-400 mb-8 tracking-wide">
                Try a different search term or browse all products.
              </p>
              <Link
                href="/shop"
                className="text-[11px] uppercase tracking-[0.2em] font-light text-black border-b border-black pb-0.5 hover:opacity-50 transition-opacity"
              >
                View All
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
