import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getOrders } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = getOrders()
    .filter((o) => o.customerEmail === user.email)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json(orders);
}
