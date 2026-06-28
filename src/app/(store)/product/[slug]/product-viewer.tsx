"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import ProductActions from "./product-actions";

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
  ebony: "#111111",
};

function resolveColor(name: string): string {
  return COLOR_MAP[name.toLowerCase()] ?? "#888888";
}

/**
 * ProductViewer owns the full two-column layout:
 * left = reactive image panel, right = name + description (as children) + actions
 */
export default function ProductViewer({
  product,
  children,
}: {
  product: Product;
  children: React.ReactNode;
}) {
  const initialColor = product.colors[0] || "";
  const [selectedColor, setSelectedColor] = useState(initialColor);

  const overlayColor = selectedColor ? resolveColor(selectedColor) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
      {/* ── Image panel ── */}
      <div className="relative aspect-[3/4] bg-neutral-50 overflow-hidden">
        {product.images[0] ? (
          <>
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-700"
            />
            {/* Colour tint overlay — CSS mix-blend-mode:color */}
            <div
              className="absolute inset-0 transition-all duration-500 pointer-events-none"
              style={{
                backgroundColor: overlayColor ?? "transparent",
                mixBlendMode: "color",
                opacity: overlayColor ? 0.45 : 0,
              }}
            />
          </>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center transition-colors duration-500"
            style={{ backgroundColor: overlayColor ?? "#f5f5f0" }}
          >
            <span className="font-[family-name:var(--font-serif)] text-7xl font-light text-white/40 italic">
              {product.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Active colour chip */}
        {selectedColor && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5">
            <span
              className="w-3 h-3 rounded-full border border-neutral-200"
              style={{ backgroundColor: resolveColor(selectedColor) }}
            />
            <span className="text-[9px] uppercase tracking-[0.2em] font-light text-black">
              {selectedColor}
            </span>
          </div>
        )}
      </div>

      {/* ── Right panel: server-rendered content + client actions ── */}
      <div className="flex flex-col">
        {/* Static name/description/meta passed as children from server page */}
        {children}
        {/* Client actions — colour change propagates back to image */}
        <ProductActions product={product} onColorChange={setSelectedColor} />
      </div>
    </div>
  );
}
