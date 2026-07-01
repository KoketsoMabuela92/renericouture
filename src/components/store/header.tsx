"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Menu, X, Search, User, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "New Arrivals", href: "/shop?category=new-arrivals" },
  { name: "Women", href: "/shop?category=women" },
  { name: "Men", href: "/shop?category=men" },
  { name: "Accessories", href: "/shop?category=accessories" },
];

interface AuthUser { id: string; email: string; firstName: string; lastName: string; role: string; }

export default function StoreHeader() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const items = useCartStore((s) => s.items);
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d || null)).catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        {/* Announcement bar */}
        <div className="bg-black text-white text-center py-2 px-4">
          <p className="text-[10px] uppercase tracking-[0.2em] font-light">
            Free shipping over R1,500 &nbsp;|&nbsp; Code <span className="font-medium">RENERI15</span> — 15% off
          </p>
        </div>

        <nav className="mx-auto max-w-7xl px-4 lg:px-12">
          <div className="relative flex h-16 lg:h-20 items-center justify-between">

            {/* Mobile menu button — left */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 -ml-2 text-black"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>

            {/* Desktop nav — left */}
            <div className="hidden lg:flex items-center gap-10 flex-1">
              {navigation.slice(0, 2).map((item) => (
                <Link key={item.name} href={item.href}
                  className="text-[11px] uppercase tracking-[0.2em] font-light text-black hover:opacity-50 transition-opacity duration-200">
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Logo — always centred */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 max-w-[160px] lg:max-w-none">
              <span className="font-[family-name:var(--font-serif)] text-sm lg:text-xl font-medium tracking-[0.12em] lg:tracking-[0.15em] uppercase text-black whitespace-nowrap">
                Renéri Couture
              </span>
            </Link>

            {/* Desktop nav — right */}
            <div className="hidden lg:flex items-center gap-10 flex-1 justify-end">
              {navigation.slice(2).map((item) => (
                <Link key={item.name} href={item.href}
                  className="text-[11px] uppercase tracking-[0.2em] font-light text-black hover:opacity-50 transition-opacity duration-200">
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Icons — right */}
            <div className="flex items-center gap-4 lg:gap-6">
              <Link href="/shop" aria-label="Search" className="hidden lg:block text-black hover:opacity-50 transition-opacity duration-200">
                <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </Link>

              {/* User menu (desktop) */}
              {user ? (
                <div className="relative hidden lg:block" ref={userMenuRef}>
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1 text-black hover:opacity-50 transition-opacity duration-200" aria-label="Account menu">
                    <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
                    <span className="text-[11px] uppercase tracking-[0.15em] font-light max-w-[80px] truncate">{user.firstName}</span>
                    <ChevronDown className="h-3 w-3" strokeWidth={1.5} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-neutral-200 shadow-lg z-50">
                      <div className="px-4 py-3 border-b border-neutral-100">
                        <p className="text-xs font-medium text-neutral-900 truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-[10px] text-neutral-400 truncate mt-0.5">{user.email}</p>
                      </div>
                      {user.role === "admin" && (
                        <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-[11px] uppercase tracking-[0.15em] text-neutral-600 hover:bg-neutral-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <LayoutDashboard className="h-3.5 w-3.5" /> Admin Panel
                        </Link>
                      )}
                      <Link href="/account" className="flex items-center gap-2 px-4 py-2.5 text-[11px] uppercase tracking-[0.15em] text-neutral-600 hover:bg-neutral-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <User className="h-3.5 w-3.5" /> My Account
                      </Link>
                      <Link href="/track-order" className="flex items-center gap-2 px-4 py-2.5 text-[11px] uppercase tracking-[0.15em] text-neutral-600 hover:bg-neutral-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <ShoppingBag className="h-3.5 w-3.5" /> Track Order
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-[11px] uppercase tracking-[0.15em] text-neutral-600 hover:bg-neutral-50 transition-colors border-t border-neutral-100">
                        <LogOut className="h-3.5 w-3.5" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/account" aria-label="Account" className="hidden lg:block text-black hover:opacity-50 transition-opacity duration-200">
                  <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
                </Link>
              )}

              <Link href="/cart" className="relative text-black hover:opacity-50 transition-opacity duration-200" aria-label="Cart">
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center bg-black text-white text-[8px] font-medium">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white lg:hidden flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-neutral-200">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <span className="font-[family-name:var(--font-serif)] text-lg font-medium tracking-[0.15em] uppercase text-black">
                Renéri Couture
              </span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-10 h-10 -mr-2">
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-1">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}
                className="flex items-center py-4 text-base uppercase tracking-[0.2em] font-light text-black border-b border-neutral-100"
                onClick={() => setMobileMenuOpen(false)}>
                {item.name}
              </Link>
            ))}

            <div className="mt-6 flex flex-col gap-1">
              <Link href="/shop" className="flex items-center gap-3 py-4 text-sm uppercase tracking-[0.15em] font-light text-neutral-500 border-b border-neutral-100" onClick={() => setMobileMenuOpen(false)}>
                <Search className="h-4 w-4" strokeWidth={1.5} /> Search
              </Link>
              <Link href="/account" className="flex items-center gap-3 py-4 text-sm uppercase tracking-[0.15em] font-light text-neutral-500 border-b border-neutral-100" onClick={() => setMobileMenuOpen(false)}>
                <User className="h-4 w-4" strokeWidth={1.5} /> {user ? "My Account" : "Sign In"}
              </Link>
              <Link href="/track-order" className="flex items-center gap-3 py-4 text-sm uppercase tracking-[0.15em] font-light text-neutral-500 border-b border-neutral-100" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} /> Track Order
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin" className="flex items-center gap-3 py-4 text-sm uppercase tracking-[0.15em] font-light text-neutral-500 border-b border-neutral-100" onClick={() => setMobileMenuOpen(false)}>
                  <LayoutDashboard className="h-4 w-4" strokeWidth={1.5} /> Admin Panel
                </Link>
              )}
              {user && (
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 py-4 text-sm uppercase tracking-[0.15em] font-light text-neutral-500 border-b border-neutral-100 text-left">
                  <LogOut className="h-4 w-4" strokeWidth={1.5} /> Sign Out
                </button>
              )}
            </div>
          </div>

          {/* Bottom promo */}
          <div className="px-6 py-5 bg-neutral-50 border-t border-neutral-200 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Free shipping over R1,500 &nbsp;·&nbsp; Code <span className="font-medium text-black">RENERI15</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
