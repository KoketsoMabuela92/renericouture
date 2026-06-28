import { NextResponse } from "next/server";
import { getProducts, getOrders, getCustomers } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = getProducts();
  const orders = getOrders();
  const customers = getCustomers();

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = paidOrders.length ? totalRevenue / paidOrders.length : 0;

  const revenueByMonth: Record<string, number> = {};
  paidOrders.forEach((o) => {
    const month = new Date(o.createdAt).toLocaleString("en-ZA", { month: "short", year: "2-digit" });
    revenueByMonth[month] = (revenueByMonth[month] || 0) + o.total;
  });

  const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = { name: item.name, sales: 0, revenue: 0 };
      }
      productSales[item.productId].sales += item.quantity;
      productSales[item.productId].revenue += item.price * item.quantity;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const statusBreakdown = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    totalRevenue,
    totalOrders: orders.length,
    totalCustomers: customers.length,
    totalProducts: products.filter((p) => p.active).length,
    avgOrderValue,
    revenueByMonth,
    topProducts,
    statusBreakdown,
  });
}
