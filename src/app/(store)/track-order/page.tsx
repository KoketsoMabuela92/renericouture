"use client";

import { useState, useEffect } from "react";
import { Search, Package, Truck, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

const STATUS_INFO: Record<string, { label: string; icon: typeof Package; color: string }> = {
  pending:    { label: "Order Placed",    icon: Clock,         color: "text-amber-500" },
  confirmed:  { label: "Confirmed",       icon: CheckCircle,   color: "text-blue-500" },
  processing: { label: "Processing",      icon: Package,       color: "text-purple-500" },
  shipped:    { label: "Shipped",         icon: Truck,         color: "text-indigo-500" },
  delivered:  { label: "Delivered",       icon: CheckCircle,   color: "text-emerald-500" },
  cancelled:  { label: "Cancelled",       icon: XCircle,       color: "text-red-500" },
  returned:   { label: "Returned",        icon: AlertCircle,   color: "text-orange-500" },
};

interface TrackedOrder {
  id: string;
  customerName: string;
  status: string;
  trackingNumber?: string;
  courierService?: string;
  items: { name: string; quantity: number; price: number; size: string; color: string }[];
  total: number;
  createdAt: string;
  shippingAddress: { street: string; city: string; province: string; postalCode: string; country: string };
}

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setQuery(id);
      setLoading(true);
      fetch(`/api/orders/${id}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) setOrder(data);
          else setNotFound(true);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setOrder(null);
    setNotFound(false);

    const res = await fetch(`/api/orders/${query.trim()}`);
    if (res.ok) {
      setOrder(await res.json());
    } else {
      setNotFound(true);
    }
    setLoading(false);
  };

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1;
  const statusInfo = order ? (STATUS_INFO[order.status] ?? STATUS_INFO.pending) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <Package className="h-10 w-10 mx-auto text-neutral-400 mb-4" />
        <h1 className="text-4xl font-bold text-neutral-900 mb-3">Track Your Order</h1>
        <p className="text-neutral-500">Enter your order ID to get real-time updates.</p>
      </div>

      <div className="bg-neutral-50 rounded-2xl p-8">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter order ID (e.g. mqp3h3kds189q9lec0k)"
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Searching…" : "Track"}
          </Button>
        </form>

        {/* Not found */}
        {notFound && (
          <div className="mt-8 text-center p-8 bg-white rounded-xl border border-neutral-200">
            <Package className="h-8 w-8 mx-auto text-neutral-300 mb-3" />
            <p className="font-medium text-neutral-900 mb-1">Order not found</p>
            <p className="text-sm text-neutral-500">
              Please verify your order ID and try again.
            </p>
          </div>
        )}

        {/* Order found */}
        {order && statusInfo && (
          <div className="mt-8 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-neutral-500 font-mono mb-1">Order #{order.id.slice(-8).toUpperCase()}</p>
                  <p className="font-semibold text-neutral-900">{order.customerName}</p>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    Placed {new Date(order.createdAt).toLocaleDateString("en-ZA", { dateStyle: "long" })}
                  </p>
                </div>
                <div className={`flex items-center gap-2 text-sm font-medium ${statusInfo.color}`}>
                  <statusInfo.icon className="h-4 w-4" />
                  {statusInfo.label}
                </div>
              </div>

              {/* Progress bar */}
              {!["cancelled", "returned"].includes(order.status) && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    {STATUS_STEPS.map((step, i) => {
                      const done = i <= currentStep;
                      const active = i === currentStep;
                      return (
                        <div key={step} className="flex flex-col items-center flex-1">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-medium transition-colors
                            ${done ? "bg-black border-black text-white" : "border-neutral-200 text-neutral-300"}`}>
                            {i + 1}
                          </div>
                          <span className={`text-[9px] mt-1 uppercase tracking-wide text-center ${active ? "text-black font-medium" : "text-neutral-400"}`}>
                            {STATUS_INFO[step]?.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tracking number */}
              {order.trackingNumber && (
                <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                  <p className="text-xs text-neutral-500 mb-0.5">Tracking Number</p>
                  <p className="font-mono text-sm font-medium text-neutral-900">{order.trackingNumber}</p>
                  {order.courierService && <p className="text-xs text-neutral-500 mt-0.5">via {order.courierService}</p>}
                </div>
              )}
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Items Ordered</h3>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium text-neutral-900">{item.name}</p>
                      <p className="text-xs text-neutral-500">{item.size} / {item.color} × {item.quantity}</p>
                    </div>
                    <p className="font-medium text-neutral-900">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
                <div className="border-t border-neutral-100 pt-3 flex justify-between font-semibold text-neutral-900">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-3">Delivering to</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-neutral-500">
          Need help?{" "}
          <a href="/contact" className="text-neutral-900 font-medium underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
