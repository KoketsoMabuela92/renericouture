"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@renericouture.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed");
      setLoading(false);
      return;
    }

    if (data.user?.role !== "admin") {
      setError("Access denied — admin account required");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-[family-name:var(--font-serif)] text-2xl font-medium tracking-[0.15em] uppercase text-black">
            Renéri Couture
          </h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 mt-2">
            Admin Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-neutral-200 p-8">
          <h2 className="text-sm font-light text-black mb-6 tracking-wide">
            Sign in to continue
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-light text-neutral-500 block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-b border-neutral-200 focus:border-black outline-none py-2 text-sm font-light text-black bg-transparent transition-colors duration-200"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-light text-neutral-500 block mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border-b border-neutral-200 focus:border-black outline-none py-2 text-sm font-light text-black bg-transparent transition-colors duration-200"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 font-light">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-black text-white text-[11px] uppercase tracking-[0.25em] font-light hover:bg-neutral-800 transition-colors duration-200 disabled:opacity-50 mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-100">
            <p className="text-[10px] text-neutral-400 text-center font-light">
              Default credentials: admin@renericouture.com / admin123
            </p>
          </div>
        </div>

        <p className="text-center mt-6">
          <a href="/" className="text-[10px] uppercase tracking-[0.2em] font-light text-neutral-400 hover:text-black transition-colors">
            ← Return to Store
          </a>
        </p>
      </div>
    </div>
  );
}
