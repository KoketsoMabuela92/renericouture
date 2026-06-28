"use client";

import { useState } from "react";
import { ShoppingBag, Heart, Check } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const COLOR_MAP: Record<string, string> = {
  black: "#111111",
  white: "#f5f5f5",
  ivory: "#f7f3eb",
  ecru: "#e8e0ce",
  stone: "#c8b89a",
  camel: "#c49a5a",
  tan: "#c8a86a",
  brown: "#8b5e3c",
  chocolate: "#5c3317",
  navy: "#1a2744",
  "midnight blue": "#1a2035",
  blue: "#2563eb",
  "light blue": "#93c5fd",
  grey: "#9ca3af",
  gray: "#9ca3af",
  charcoal: "#4b4b4b",
  taupe: "#b5a898",
  beige: "#d4c5a9",
  sage: "#8faa8b",
  olive: "#6b7a3d",
  green: "#16a34a",
  emerald: "#059669",
  burgundy: "#7c1d33",
  red: "#dc2626",
  pink: "#f472b6",
  blush: "#f9a8c9",
  purple: "#7c3aed",
  lavender: "#c4b5fd",
  yellow: "#facc15",
  gold: "#ca8a04",
  orange: "#f97316",
  "washed black": "#2a2a2a",
  "ebony": "#111111",
};

function resolveColor(name: string): string {
  return COLOR_MAP[name.toLowerCase()] ?? "#888888";
}

export default function ProductActions({ product, onColorChange }: { product: Product; onColorChange?: (color: string) => void }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  function pickColor(color: string) {
    setSelectedColor(color);
    onColorChange?.(color);
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Price */}
      <div className="flex items-baseline gap-4">
        <span className="font-[family-name:var(--font-serif)] text-3xl font-light text-black">
          {formatCurrency(product.price)}
        </span>
        {hasDiscount && (
          <span className="text-sm font-light text-neutral-400 line-through">
            {formatCurrency(product.compareAtPrice!)}
          </span>
        )}
        {hasDiscount && (
          <span className="text-[10px] uppercase tracking-[0.15em] font-light bg-black text-white px-2 py-0.5">
            Save {formatCurrency(product.compareAtPrice! - product.price)}
          </span>
        )}
      </div>

      {/* Size selector */}
      {product.sizes.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] font-light text-black mb-4">
            Size — <span className="text-neutral-500">{selectedSize}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 text-xs font-light border transition-colors duration-200 ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 text-neutral-600 hover:border-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color selector */}
      {product.colors.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] font-light text-black mb-4">
            Colour — <span className="text-neutral-500">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => {
              const hex = resolveColor(color);
              const isLight = ["white", "ivory", "ecru", "cream", "beige", "blush", "lavender"].includes(color.toLowerCase());
              return (
                <button
                  key={color}
                  title={color}
                  onClick={() => pickColor(color)}
                  className={`relative w-8 h-8 rounded-full transition-all duration-200 ${
                    selectedColor === color
                      ? "ring-2 ring-offset-2 ring-black scale-110"
                      : "hover:scale-105"
                  } ${isLight ? "border border-neutral-200" : ""}`}
                  style={{ backgroundColor: hex }}
                />
              );
            })}
          </div>
          <p className="text-xs font-light text-neutral-400 mt-2">{selectedColor}</p>
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] font-light text-black mb-4">Quantity</p>
        <div className="flex items-center border border-neutral-200 w-fit">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 text-neutral-500 hover:text-black transition-colors text-lg font-light"
          >
            −
          </button>
          <span className="w-10 h-10 flex items-center justify-center text-sm font-light text-black border-x border-neutral-200">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="w-10 h-10 text-neutral-500 hover:text-black transition-colors text-lg font-light"
          >
            +
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1 h-14 bg-black text-white text-[11px] uppercase tracking-[0.25em] font-light hover:bg-neutral-800 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {added ? (
            <><Check className="h-3.5 w-3.5" strokeWidth={1.5} /> Added</>
          ) : (
            <><ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} /> Add to Cart</>
          )}
        </button>
        <button className="w-14 h-14 border border-neutral-200 hover:border-black transition-colors duration-200 flex items-center justify-center text-neutral-400 hover:text-black">
          <Heart className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      {product.stock > 0 && product.stock < 10 && (
        <p className="text-[10px] uppercase tracking-[0.2em] font-light text-neutral-500">
          Only {product.stock} pieces remaining
        </p>
      )}
      {product.stock === 0 && (
        <p className="text-[10px] uppercase tracking-[0.2em] font-light text-neutral-400">
          Out of stock
        </p>
      )}
    </div>
  );
}
