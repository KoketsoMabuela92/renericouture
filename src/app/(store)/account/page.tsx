"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Lock, LogOut, Package, LayoutDashboard, ChevronRight, Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/lib/types";
import { useWishlist } from "@/lib/useWishlist";

interface AuthUser { id: string; email: string; firstName: string; lastName: string; role: string; }

const statusColors: Record<string, "default" | "success" | "warning" | "secondary" | "destructive"> = {
  pending: "warning",
  confirmed: "secondary",
  processing: "default",
  shipped: "default",
  delivered: "success",
  cancelled: "destructive",
  returned: "destructive",
};

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<AuthUser | null | undefined>(undefined);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist">("orders");
  const { items: wishlistItems, toggle: toggleWishlist } = useWishlist();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        setCurrentUser(d || null);
        if (d) {
          setOrdersLoading(true);
          fetch("/api/account/orders")
            .then((r) => r.json())
            .then((o) => setOrders(Array.isArray(o) ? o : []))
            .finally(() => setOrdersLoading(false));
        }
      })
      .catch(() => setCurrentUser(null));
  }, []);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "register" && form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      const redirect = searchParams.get("redirect") || null;
      if (data.user?.role === "admin") {
        router.push("/admin");
      } else if (redirect) {
        router.push(redirect);
      } else {
        router.push("/");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
    router.refresh();
  };

  if (currentUser === undefined) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin h-6 w-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full" /></div>;
  }

  if (currentUser) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-lg font-medium text-neutral-600 flex-shrink-0">
              {currentUser.firstName.charAt(0)}{currentUser.lastName.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">{currentUser.firstName} {currentUser.lastName}</h1>
              <p className="text-sm text-neutral-500">{currentUser.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentUser.role === "admin" && (
              <Link href="/admin">
                <Button variant="outline" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" /> Admin
                </Button>
              </Link>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 mb-6">
          {(["orders", "wishlist"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-3 text-[11px] uppercase tracking-[0.15em] font-medium border-b-2 transition-colors ${
                activeTab === tab ? "border-black text-black" : "border-transparent text-neutral-400 hover:text-neutral-600"
              }`}
            >
              {tab === "orders" ? <Package className="h-3.5 w-3.5" /> : <Heart className="h-3.5 w-3.5" />}
              {tab === "orders" ? `Orders (${orders.length})` : `Wishlist (${wishlistItems.length})`}
            </button>
          ))}
        </div>

        {/* Order History */}
        {activeTab === "orders" && <div>
          {ordersLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin h-6 w-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 border border-neutral-200 rounded-xl">
              <Package className="h-10 w-10 mx-auto text-neutral-300 mb-3" />
              <p className="font-medium text-neutral-900 mb-1">No orders yet</p>
              <p className="text-sm text-neutral-500 mb-6">When you place an order it will appear here.</p>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="border border-neutral-200 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-mono text-xs text-neutral-400 mb-0.5">#{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-neutral-500">
                        {new Date(order.createdAt).toLocaleDateString("en-ZA", { dateStyle: "long" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusColors[order.status] ?? "default"}>
                        {order.status}
                      </Badge>
                      <span className="font-semibold text-neutral-900">{formatCurrency(order.total)}</span>
                    </div>
                  </div>

                  <div className="space-y-1 mb-3">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-sm text-neutral-600">
                        {item.name} <span className="text-neutral-400">× {item.quantity}</span>
                        {item.size && item.size !== "One Size" && <span className="text-neutral-400"> · {item.size}</span>}
                      </p>
                    ))}
                  </div>

                  <Link
                    href={`/track-order?id=${order.id}`}
                    className="inline-flex items-center text-xs text-neutral-500 hover:text-neutral-900 transition-colors gap-1"
                  >
                    Track order <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>}

        {/* Wishlist */}
        {activeTab === "wishlist" && (
          <div>
            {wishlistItems.length === 0 ? (
              <div className="text-center py-16 border border-neutral-200 rounded-xl">
                <Heart className="h-10 w-10 mx-auto text-neutral-300 mb-3" />
                <p className="font-medium text-neutral-900 mb-1">Your wishlist is empty</p>
                <p className="text-sm text-neutral-500 mb-6">Save items you love to find them later.</p>
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/shop">Browse Collection</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {wishlistItems.map((product) => (
                  <div key={product.id} className="border border-neutral-200 rounded-xl overflow-hidden group">
                    <Link href={`/product/${product.slug}`} className="block aspect-[3/4] overflow-hidden bg-neutral-100 relative">
                      {product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-[family-name:var(--font-serif)] text-4xl font-light text-neutral-300 italic">{product.name.charAt(0)}</span>
                        </div>
                      )}
                    </Link>
                    <div className="p-3">
                      <Link href={`/product/${product.slug}`}>
                        <p className="text-[11px] uppercase tracking-[0.12em] font-light text-black truncate mb-1">{product.name}</p>
                        <p className="text-sm font-light text-black mb-3">{formatCurrency(product.price)}</p>
                      </Link>
                      <div className="flex gap-2">
                        <Link href={`/product/${product.slug}`} className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-black text-white text-[10px] uppercase tracking-[0.15em] font-light rounded">
                          <ShoppingBag className="h-3 w-3" /> Add to Cart
                        </Link>
                        <button onClick={() => toggleWishlist(product)} className="w-9 h-9 border border-neutral-200 rounded flex items-center justify-center text-neutral-400 hover:text-red-500 hover:border-red-200 transition-colors">
                          <Heart className="h-3.5 w-3.5" fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
          <User className="h-6 w-6 text-neutral-600" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          {mode === "login"
            ? "Sign in to your account"
            : "Join Renéri Couture for exclusive benefits"}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                First Name
              </label>
              <Input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                Last Name
              </label>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              name="email"
              type="email"
              className="pl-10"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              name="password"
              type="password"
              className="pl-10"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
        </div>

        {mode === "register" && (
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                name="confirmPassword"
                type="password"
                className="pl-10"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          </div>
        )}

        <Button type="submit" className="w-full rounded-full" size="lg" disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Sign In"
            : "Create Account"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          {mode === "login"
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>

    </div>
  );
}
