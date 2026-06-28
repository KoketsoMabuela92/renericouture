import { NextResponse } from "next/server";
import { getProducts, getOrders, getCustomers } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = getProducts();
  const orders = getOrders();
  const customers = getCustomers();

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return NextResponse.json({
    totalRevenue,
    totalOrders: orders.length,
    totalCustomers: customers.length,
    totalProducts: products.length,
    recentOrders,
  });
}
