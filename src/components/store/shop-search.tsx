"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function ShopSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    router.push(`/shop?${params.toString()}`);
  }

  function clear() {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} className="relative w-full max-w-sm">
      <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" strokeWidth={1.5} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products…"
        className="w-full pl-6 pr-8 py-2 text-sm font-light text-black placeholder:text-neutral-400 border-b border-neutral-300 focus:border-black focus:outline-none bg-transparent transition-colors duration-200"
      />
      {query && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      )}
    </form>
  );
}
