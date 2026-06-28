"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-4">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            <span className="font-[family-name:var(--font-serif)] text-4xl font-light text-neutral-300 italic">
              {product.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Labels */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="text-[9px] uppercase tracking-[0.2em] font-light bg-black text-white px-2 py-0.5">
              −{discountPercent}%
            </span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="text-[9px] uppercase tracking-[0.2em] font-light bg-white text-black border border-black px-2 py-0.5">
              Last pieces
            </span>
          )}
        </div>

        {/* Hover CTA */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="bg-black text-white text-center py-3 text-[10px] uppercase tracking-[0.25em] font-light">
            View Details
          </div>
        </div>
      </div>

      {/* Info */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.15em] font-light text-black mb-1.5">
          {product.name}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-sm font-light text-black">
            {formatCurrency(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-neutral-400 line-through font-light">
              {formatCurrency(product.compareAtPrice!)}
            </span>
          )}
        </div>
        {product.colors.length > 0 && (
          <p className="text-[10px] font-light text-neutral-400 mt-1 tracking-wide">
            {product.colors.slice(0, 3).join(" · ")}
            {product.colors.length > 3 && ` +${product.colors.length - 3}`}
          </p>
        )}
      </div>
    </Link>
  );
}
