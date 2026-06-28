import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProducts, getProductBySlug } from "@/lib/db";
import ProductCard from "@/components/store/product-card";
import ProductViewer from "./product-viewer";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | Renéri Couture`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = getProducts()
    .filter((p) => p.category === product.category && p.id !== product.id && p.active)
    .slice(0, 4);

  const categorySlug = product.category.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12">

      {/* ── Breadcrumbs ─────────────────────────────────── */}
      <nav className="py-5 border-b border-neutral-100 flex items-center gap-2" aria-label="Breadcrumb">
        <Link href="/" className="text-[10px] uppercase tracking-[0.2em] font-light text-neutral-400 hover:text-black transition-colors duration-200">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-neutral-300" strokeWidth={1.5} />
        <Link href="/shop" className="text-[10px] uppercase tracking-[0.2em] font-light text-neutral-400 hover:text-black transition-colors duration-200">
          Shop
        </Link>
        <ChevronRight className="h-3 w-3 text-neutral-300" strokeWidth={1.5} />
        <Link
          href={`/shop?category=${categorySlug}`}
          className="text-[10px] uppercase tracking-[0.2em] font-light text-neutral-400 hover:text-black transition-colors duration-200"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3 text-neutral-300" strokeWidth={1.5} />
        <span className="text-[10px] uppercase tracking-[0.2em] font-light text-black">
          {product.name}
        </span>
      </nav>

      {/* ── Product grid ─────────────────────────────────── */}
      <div className="py-12">
        {/*
          ProductViewer is a client component that owns colour state.
          It renders: left=image panel, right=children + ProductActions.
          We pass the static server-rendered info (name, desc, meta) as children.
        */}
        <ProductViewer product={product}>
          {/* Category label */}
          <div className="flex items-center gap-2 mb-4">
            <Link
              href={`/shop?category=${categorySlug}`}
              className="text-[10px] uppercase tracking-[0.25em] font-light text-neutral-400 hover:text-black transition-colors"
            >
              {product.category}
            </Link>
            {product.subcategory && (
              <>
                <span className="text-neutral-300 text-xs">·</span>
                <span className="text-[10px] uppercase tracking-[0.25em] font-light text-neutral-400">
                  {product.subcategory}
                </span>
              </>
            )}
          </div>

          {/* Product name */}
          <h1 className="font-[family-name:var(--font-serif)] text-4xl lg:text-5xl font-light leading-tight text-black mb-6">
            {product.name}
          </h1>

          {/* Description */}
          <p className="text-sm font-light text-neutral-500 leading-loose mb-8 max-w-md">
            {product.description}
          </p>
        </ProductViewer>
      </div>

      {/* ── Related Products ─────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-neutral-200 py-20">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="font-[family-name:var(--font-serif)] text-2xl font-light italic text-black">
              You May Also Like
            </h2>
            <Link
              href={`/shop?category=${categorySlug}`}
              className="text-[11px] uppercase tracking-[0.2em] font-light text-black border-b border-black pb-0.5 hover:opacity-50 transition-opacity"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
