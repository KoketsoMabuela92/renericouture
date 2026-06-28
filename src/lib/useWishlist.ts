"use client";

import { useEffect, useCallback } from "react";
import { useWishlistStore } from "./store";
import { Product } from "./types";

export function useWishlist() {
  const { items, loaded, setItems, toggleLocal, isWishlisted, clear } = useWishlistStore();

  useEffect(() => {
    if (loaded) return;

    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then(async (user) => {
        if (user?.id) {
          const localIds = items.map((p) => p.id);
          if (localIds.length > 0) {
            await fetch("/api/account/wishlist", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productIds: localIds }),
            });
          }
          const res = await fetch("/api/account/wishlist");
          if (res.ok) {
            const data = await res.json();
            setItems(data.map((w: { product: Product }) => w.product).filter(Boolean));
          }
        } else {
          setItems(items);
        }
      })
      .catch(() => setItems(items));
  }, []);

  const toggle = useCallback(
    async (product: Product) => {
      const alreadyWishlisted = isWishlisted(product.id);
      toggleLocal(product);

      const user = await fetch("/api/auth/me").then((r) => (r.ok ? r.json() : null)).catch(() => null);
      if (!user?.id) return;

      if (alreadyWishlisted) {
        await fetch("/api/account/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
      } else {
        await fetch("/api/account/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
      }
    },
    [isWishlisted, toggleLocal]
  );

  return { items, toggle, isWishlisted, clear };
}
