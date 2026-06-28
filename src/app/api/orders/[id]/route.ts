import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrder } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const admin = await isAdmin();
  if (!admin) {
    const { passwordHash: _ph, ...safeOrder } = order as typeof order & { passwordHash?: string };
    return NextResponse.json({
      id: order.id,
      customerName: order.customerName,
      status: order.status,
      trackingNumber: order.trackingNumber,
      courierService: order.courierService,
      items: order.items,
      total: order.total,
      createdAt: order.createdAt,
      shippingAddress: order.shippingAddress,
    });
  }
  return NextResponse.json(order);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const order = updateOrder(id, body);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
