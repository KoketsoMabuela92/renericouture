"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { Lock, CreditCard, ShieldCheck, User } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"info" | "payment" | "success">("info");
  const [orderError, setOrderError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [authUser, setAuthUser] = useState<{email: string; firstName: string; lastName: string} | null>(null);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.ok ? r.json() : null)
      .then((u) => {
        if (u?.email) {
          setAuthUser(u);
          setForm((prev) => ({
            ...prev,
            email: u.email || prev.email,
            firstName: u.firstName || prev.firstName,
            lastName: u.lastName || prev.lastName,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shipping = subtotal >= 1500 ? 0 : 150;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
    country: "South Africa",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  const createOrder = async (paystackReference: string) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail: form.email,
        customerName: `${form.firstName} ${form.lastName}`,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          image: i.image,
        })),
        shippingAddress: {
          street: form.street,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
          country: form.country,
        },
        subtotal,
        shippingCost: shipping,
        tax,
        total,
        paystackReference,
      }),
    });

    if (res.ok) {
      clearCart();
      setStep("success");
    } else {
      const data = await res.json();
      setOrderError(data.error || "Failed to place order. Please try again.");
    }
  };

  const handlePayWithPaystack = async () => {
    setLoading(true);
    setOrderError("");

    try {
      const initRes = await fetch("/api/payment/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          amount: total,
          metadata: {
            customerName: `${form.firstName} ${form.lastName}`,
            phone: form.phone,
          },
        }),
      });

      if (!initRes.ok) {
        const err = await initRes.json();
        setOrderError(err.error || "Could not initialize payment.");
        setLoading(false);
        return;
      }

      const { access_code, reference } = await initRes.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const PaystackPop = (window as any).PaystackPop;
      if (!PaystackPop) {
        setOrderError("Payment library failed to load. Please refresh and try again.");
        setLoading(false);
        return;
      }

      const handler = PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: Math.round(total * 100),
        currency: "ZAR",
        access_code,
        ref: reference,
        onClose: () => {
          setLoading(false);
        },
        callback: (response: { reference: string }) => {
          fetch(`/api/payment/paystack/verify?reference=${response.reference}`)
            .then((verifyRes) => {
              if (verifyRes.ok) {
                return createOrder(response.reference);
              } else {
                setOrderError("Payment verification failed. Please contact support.");
                setLoading(false);
              }
            })
            .catch(() => {
              setOrderError("Payment verification failed. Please try again.");
              setLoading(false);
            });
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error("Paystack error:", err);
      setOrderError("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hydrated && items.length === 0 && step !== "success") {
      router.push("/cart");
    }
  }, [hydrated, items.length, step, router]);

  if (!hydrated) return null;
  if (items.length === 0 && step !== "success") return null;

  if (step === "success") {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
          <span className="text-2xl">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">Order Confirmed!</h1>
        <p className="text-neutral-500 mb-8">
          Thank you for your purchase. You&apos;ll receive an email confirmation shortly.
        </p>
        <Button onClick={() => router.push("/shop")} className="rounded-full">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-neutral-900 mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Form */}
        <div className="lg:col-span-3 space-y-8">
          {step === "info" && (
            <>
              {/* Auth status */}
              {authUser ? (
                <div className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{authUser.firstName} {authUser.lastName}</p>
                    <p className="text-xs text-neutral-500">{authUser.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <p className="text-sm text-neutral-600">Already have an account?</p>
                  <Link href={`/account?redirect=/checkout`} className="text-sm font-medium text-black underline underline-offset-2">
                    Sign in
                  </Link>
                </div>
              )}

              {/* Contact */}
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Shipping */}
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    name="firstName"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="lastName"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                  <div className="col-span-2">
                    <Input
                      name="street"
                      placeholder="Street address"
                      value={form.street}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Input
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="province"
                    placeholder="Province"
                    value={form.province}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="postalCode"
                    placeholder="Postal code"
                    value={form.postalCode}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>

              <Button
                onClick={() => setStep("payment")}
                className="w-full rounded-full"
                size="lg"
                disabled={!form.email || !form.firstName || !form.lastName || !form.street || !form.city}
              >
                Continue to Payment
              </Button>
            </>
          )}

          {step === "payment" && (
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Payment</h2>

              <div className="border border-neutral-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Secure Payment via Paystack</p>
                    <p className="text-xs text-neutral-500">256-bit SSL · All major cards accepted · Instant EFT</p>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  {["Visa", "Mastercard", "Amex", "EFT"].map((m) => (
                    <span key={m} className="text-[10px] font-medium bg-neutral-100 text-neutral-600 px-2 py-1 rounded">{m}</span>
                  ))}
                </div>

                <p className="text-xs text-neutral-400">
                  <CreditCard className="inline h-3 w-3 mr-1" />
                  You&apos;ll be securely redirected to Paystack to complete payment.
                </p>
              </div>

              <div className="mt-4 p-4 bg-neutral-50 rounded-xl text-sm">
                <p className="font-medium text-neutral-900 mb-1">Order Summary</p>
                <p className="text-neutral-500">Paying <span className="font-semibold text-neutral-900">{formatCurrency(total)}</span> for {items.length} item{items.length !== 1 ? "s" : ""}</p>
              </div>

              {orderError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {orderError}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep("info")}
                  className="rounded-full"
                  size="lg"
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  onClick={handlePayWithPaystack}
                  className="flex-1 rounded-full bg-[#0ba4db] hover:bg-[#0990c5] text-white"
                  size="lg"
                  disabled={loading}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {loading ? "Opening Paystack..." : `Pay ${formatCurrency(total)}`}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-2">
          <div className="bg-neutral-50 rounded-xl p-6 sticky top-28">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Order Summary ({items.length} items)
            </h2>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex items-center gap-3"
                >
                  <div className="w-12 h-14 rounded-lg bg-neutral-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-light text-neutral-400">
                      {item.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{item.name}</p>
                    <p className="text-xs text-neutral-500">
                      {item.size} / {item.color} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-neutral-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-neutral-200 pt-4">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">VAT (15%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold text-neutral-900">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
