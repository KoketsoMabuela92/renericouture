"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { Order, OrderStatus } from "@/lib/types";
import {
  Search,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Truck,
  Package as PackageIcon,
  X,
  CalendarIcon,
} from "lucide-react";

const PAGE_SIZE = 10;

const statusColors: Record<string, "default" | "success" | "warning" | "secondary" | "destructive"> = {
  pending: "warning",
  confirmed: "secondary",
  processing: "default",
  shipped: "default",
  delivered: "success",
  cancelled: "destructive",
  returned: "destructive",
};

const allStatuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    if (res.ok) {
      const data = await res.json();
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingOrder(orderId);
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchOrders();
    setUpdatingOrder(null);
  };

  const handleUpdateTracking = async (orderId: string, trackingNumber: string, courierService: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackingNumber, courierService, status: "shipped" }),
    });
    await fetchOrders();
  };

  const filteredOrders = useMemo(() => {
    let list = orders
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((o) => o.status === statusFilter);
    }
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      list = list.filter((o) => new Date(o.createdAt).getTime() >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime() + 86400000;
      list = list.filter((o) => new Date(o.createdAt).getTime() <= to);
    }
    return list;
  }, [orders, search, statusFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginated = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetFilters() {
    setSearch(""); setStatusFilter("all"); setDateFrom(""); setDateTo(""); setPage(1);
  }

  const hasFilters = search || statusFilter !== "all" || dateFrom || dateTo;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Orders</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage and track customer orders ({filteredOrders.length} of {orders.length} total)
        </p>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search by ID, name or email…"
            className="pl-10"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <select
          className="h-9 px-3 text-sm border border-neutral-200 rounded-md bg-white text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="all">All statuses</option>
          {allStatuses.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-neutral-400 flex-shrink-0" />
          <Input
            type="date"
            className="h-9 text-sm w-36"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
          />
          <span className="text-neutral-400 text-sm">–</span>
          <Input
            type="date"
            className="h-9 text-sm w-36"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
          />
        </div>

        {hasFilters && (
          <Button variant="outline" size="sm" onClick={resetFilters} className="gap-1">
            <X className="h-3 w-3" /> Clear
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin h-8 w-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart className="h-10 w-10 mx-auto text-neutral-300 mb-3" />
              <p className="text-sm text-neutral-500">No orders found</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {paginated.map((order) => (
                  <div key={order.id}>
                    <div
                      className="flex items-center justify-between p-4 hover:bg-neutral-50/50 cursor-pointer transition-colors"
                      onClick={() =>
                        setExpandedOrder(expandedOrder === order.id ? null : order.id)
                      }
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-mono text-xs text-neutral-500">
                            #{order.id.slice(-6)}
                          </p>
                          <p className="font-medium text-neutral-900 text-sm">
                            {order.customerName}
                          </p>
                          <p className="text-xs text-neutral-500">{order.customerEmail}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-neutral-900">
                            {formatCurrency(order.total)}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <Badge variant={statusColors[order.status]}>{order.status}</Badge>
                        <span className="text-xs text-neutral-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        {expandedOrder === order.id ? (
                          <ChevronUp className="h-4 w-4 text-neutral-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-neutral-400" />
                        )}
                      </div>
                    </div>

                    {/* Expanded order details */}
                    {expandedOrder === order.id && (
                      <div className="px-4 pb-4 bg-neutral-50/50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white rounded-lg border border-neutral-100">
                          {/* Items */}
                          <div>
                            <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                              <PackageIcon className="h-4 w-4" /> Items
                            </h4>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <div>
                                    <p className="text-neutral-900">{item.name}</p>
                                    <p className="text-xs text-neutral-500">
                                      {item.size} / {item.color} × {item.quantity}
                                    </p>
                                  </div>
                                  <span className="text-neutral-600">
                                    {formatCurrency(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))}
                              <div className="border-t border-neutral-100 pt-2 mt-2 space-y-1 text-sm">
                                <div className="flex justify-between text-neutral-500">
                                  <span>Subtotal</span>
                                  <span>{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-500">
                                  <span>Shipping</span>
                                  <span>{formatCurrency(order.shippingCost)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-500">
                                  <span>Tax</span>
                                  <span>{formatCurrency(order.tax)}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-neutral-900">
                                  <span>Total</span>
                                  <span>{formatCurrency(order.total)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Shipping */}
                          <div>
                            <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                              <Truck className="h-4 w-4" /> Shipping
                            </h4>
                            <div className="text-sm text-neutral-600 space-y-1">
                              <p>{order.shippingAddress.street}</p>
                              <p>
                                {order.shippingAddress.city}, {order.shippingAddress.province}
                              </p>
                              <p>
                                {order.shippingAddress.postalCode},{" "}
                                {order.shippingAddress.country}
                              </p>
                            </div>
                            {order.trackingNumber && (
                              <div className="mt-3 p-2 bg-neutral-50 rounded-lg">
                                <p className="text-xs text-neutral-500">Tracking</p>
                                <p className="text-sm font-mono text-neutral-900">
                                  {order.trackingNumber}
                                </p>
                                {order.courierService && (
                                  <p className="text-xs text-neutral-500">
                                    via {order.courierService}
                                  </p>
                                )}
                              </div>
                            )}
                            {!order.trackingNumber && order.status !== "cancelled" && (
                              <TrackingForm
                                orderId={order.id}
                                onSave={handleUpdateTracking}
                              />
                            )}
                          </div>

                          {/* Status update */}
                          <div>
                            <h4 className="text-sm font-semibold text-neutral-900 mb-3">
                              Update Status
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {allStatuses.map((status) => (
                                <Button
                                  key={status}
                                  size="sm"
                                  variant={order.status === status ? "default" : "outline"}
                                  className="text-xs capitalize"
                                  disabled={updatingOrder === order.id}
                                  onClick={() => handleUpdateStatus(order.id, status)}
                                >
                                  {status}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-sm text-neutral-500">
            Page {page} of {totalPages} · {filteredOrders.length} orders
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={page === 1}>
              «
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
              return (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(p)}
                  className="w-9"
                >
                  {p}
                </Button>
              );
            })}
            <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
              »
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function TrackingForm({
  orderId,
  onSave,
}: {
  orderId: string;
  onSave: (orderId: string, tracking: string, courier: string) => void;
}) {
  const [show, setShow] = useState(false);
  const [tracking, setTracking] = useState("");
  const [courier, setCourier] = useState("");

  if (!show) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="mt-3 text-xs"
        onClick={() => setShow(true)}
      >
        <Truck className="h-3 w-3 mr-1" /> Add Tracking
      </Button>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      <Input
        placeholder="Tracking number"
        value={tracking}
        onChange={(e) => setTracking(e.target.value)}
        className="text-xs"
      />
      <Input
        placeholder="Courier (e.g. Aramex, DHL)"
        value={courier}
        onChange={(e) => setCourier(e.target.value)}
        className="text-xs"
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          className="text-xs"
          onClick={() => {
            onSave(orderId, tracking, courier);
            setShow(false);
          }}
          disabled={!tracking}
        >
          Save
        </Button>
        <Button size="sm" variant="ghost" className="text-xs" onClick={() => setShow(false)}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
