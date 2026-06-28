"use client";

import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shipping = subtotal >= 1500 ? 0 : 150;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-neutral-300 mb-6" />
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">Your cart is empty</h1>
        <p className="text-neutral-500 mb-8">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Button asChild className="rounded-full">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-neutral-900">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-sm text-neutral-500 hover:text-red-500 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex gap-4 p-4 border border-neutral-200 rounded-xl"
            >
              {/* Item image placeholder */}
              <div className="w-24 h-28 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-light text-neutral-400">
                  {item.name.charAt(0)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-neutral-900 text-sm">{item.name}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {item.size} / {item.color}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-end justify-between mt-4">
                  <div className="flex items-center border border-neutral-200 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.color,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="p-1.5 text-neutral-600 hover:text-neutral-900"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.color,
                          item.quantity + 1
                        )
                      }
                      className="p-1.5 text-neutral-600 hover:text-neutral-900"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="font-semibold text-neutral-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <Link
            href="/shop"
            className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 transition-colors mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Continue Shopping
          </Link>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-50 rounded-xl p-6 sticky top-28">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span className="text-neutral-900 font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span className="text-neutral-900 font-medium">
                  {shipping === 0 ? "Free" : formatCurrency(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-neutral-400">
                  Free shipping on orders over R1,500
                </p>
              )}
              <div className="border-t border-neutral-200 pt-3 flex justify-between">
                <span className="font-semibold text-neutral-900">Total</span>
                <span className="font-bold text-neutral-900 text-lg">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <Button asChild className="w-full mt-6 rounded-full" size="lg">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>

            <div className="mt-4 text-center">
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                Secure checkout powered by SSL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
