"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Package, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  avgOrderValue: number;
  revenueByMonth: Record<string, number>;
  topProducts: { name: string; sales: number; revenue: number }[];
  statusBreakdown: Record<string, number>;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const monthEntries = data ? Object.entries(data.revenueByMonth) : [];
  const maxRevenue = monthEntries.length ? Math.max(...monthEntries.map(([, v]) => v)) : 1;

  const statCards = [
    { label: "Total Revenue", value: formatCurrency(data?.totalRevenue ?? 0), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Orders", value: String(data?.totalOrders ?? 0), icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Avg. Order Value", value: formatCurrency(data?.avgOrderValue ?? 0), icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Active Products", value: String(data?.totalProducts ?? 0), icon: Package, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Analytics</h1>
        <p className="text-sm text-neutral-500 mt-1">Live store performance from your order and product data.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-6">
              <div className={`inline-flex p-2 rounded-lg ${s.bg} mb-4`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-neutral-900">{s.value}</p>
              <p className="text-sm text-neutral-500 mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue by month chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Revenue by Month</CardTitle>
        </CardHeader>
        <CardContent>
          {monthEntries.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-neutral-400">
              No revenue data yet. Orders will appear here once placed.
            </div>
          ) : (
            <div className="h-56 flex items-end gap-2 px-4">
              {monthEntries.map(([month, rev]) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                  <div
                    className="w-full bg-neutral-900 rounded-t-md transition-all hover:bg-neutral-700"
                    style={{ height: `${Math.max(4, (rev / maxRevenue) * 180)}px` }}
                    title={formatCurrency(rev)}
                  />
                  <span className="text-[9px] text-neutral-400 truncate w-full text-center">{month}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Products by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {!data?.topProducts?.length ? (
              <p className="text-sm text-neutral-400 py-4 text-center">No sales data yet.</p>
            ) : (
              <div className="space-y-4">
                {data.topProducts.map((product, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-neutral-400 w-5">{i + 1}.</span>
                      <span className="text-sm text-neutral-900">{product.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-900">{formatCurrency(product.revenue)}</p>
                      <p className="text-xs text-neutral-500">{product.sales} unit{product.sales !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {!data?.statusBreakdown || Object.keys(data.statusBreakdown).length === 0 ? (
              <p className="text-sm text-neutral-400 py-4 text-center">No orders yet.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(data.statusBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([status, count]) => {
                    const total = Object.values(data.statusBreakdown).reduce((a, b) => a + b, 0);
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="text-neutral-900 capitalize">{status}</span>
                          <span className="text-neutral-500">{count} order{count !== 1 ? "s" : ""} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2">
                          <div className="bg-neutral-900 h-2 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-neutral-100 rounded-xl text-center">
        <p className="text-sm text-neutral-500">
          Connect Google Analytics for traffic & conversion data.
          <span className="block text-xs text-neutral-400 mt-1">Add your GA Measurement ID in Settings → Integrations</span>
        </p>
      </div>
    </div>
  );
}
