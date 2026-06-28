"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { Order } from "@/lib/types";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: Order[];
}

const statusColors: Record<string, "default" | "success" | "warning" | "secondary" | "destructive"> = {
  pending: "warning",
  confirmed: "secondary",
  processing: "default",
  shipped: "default",
  delivered: "success",
  cancelled: "destructive",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      change: "+12.5%",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Orders",
      value: stats?.totalOrders?.toString() || "0",
      icon: ShoppingCart,
      change: "+8.2%",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Customers",
      value: stats?.totalCustomers?.toString() || "0",
      icon: Users,
      change: "+5.1%",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Products",
      value: stats?.totalProducts?.toString() || "0",
      icon: Package,
      change: "+2",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Welcome back. Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="flex items-center text-xs font-medium text-emerald-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
              <p className="text-sm text-neutral-500 mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Orders</CardTitle>
          <a
            href="/admin/orders"
            className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </a>
        </CardHeader>
        <CardContent>
          {!stats?.recentOrders?.length ? (
            <div className="text-center py-10">
              <ShoppingCart className="h-10 w-10 mx-auto text-neutral-300 mb-3" />
              <p className="text-sm text-neutral-500">No orders yet</p>
              <p className="text-xs text-neutral-400 mt-1">
                Orders will appear here once customers start purchasing.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 px-2 font-medium text-neutral-500">Order ID</th>
                    <th className="text-left py-3 px-2 font-medium text-neutral-500">Customer</th>
                    <th className="text-left py-3 px-2 font-medium text-neutral-500">Status</th>
                    <th className="text-right py-3 px-2 font-medium text-neutral-500">Total</th>
                    <th className="text-right py-3 px-2 font-medium text-neutral-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                      <td className="py-3 px-2 font-mono text-xs">#{order.id.slice(-6)}</td>
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium text-neutral-900">{order.customerName}</p>
                          <p className="text-xs text-neutral-500">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant={statusColors[order.status] || "secondary"}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right font-medium">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="py-3 px-2 text-right text-neutral-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
