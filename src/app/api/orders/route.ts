import { NextRequest, NextResponse } from "next/server";
import { getOrders, createOrder, getProductById, updateProduct } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { generateId } from "@/lib/utils";
import { sendOrderConfirmation } from "@/lib/email";

export async function GET() {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getOrders());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate stock availability before creating the order
    for (const item of body.items) {
      const product = getProductById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product "${item.name}" is no longer available.` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${product.name}". Only ${product.stock} left.` },
          { status: 400 }
        );
      }
    }

    // Decrement stock for each item
    for (const item of body.items) {
      const product = getProductById(item.productId);
      if (product) {
        updateProduct(item.productId, { stock: product.stock - item.quantity });
      }
    }

    const order = createOrder({
      id: generateId(),
      customerId: body.customerId || "guest",
      customerEmail: body.customerEmail,
      customerName: body.customerName,
      items: body.items,
      shippingAddress: body.shippingAddress,
      status: "pending",
      paymentStatus: "paid",
      subtotal: body.subtotal,
      shippingCost: body.shippingCost,
      tax: body.tax,
      total: body.total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    sendOrderConfirmation(order).catch((err) =>
      console.error("[email] Failed to send order confirmation:", err)
    );

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
