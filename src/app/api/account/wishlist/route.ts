import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getWishlist, addToWishlist, removeFromWishlist, syncWishlist, getProductById } from "@/lib/db";
import { generateId } from "@/lib/utils";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = getWishlist(user.id);
  const products = items
    .map((w) => ({ ...w, product: getProductById(w.productId) }))
    .filter((w) => w.product !== undefined);

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await request.json();
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const item = addToWishlist({
    id: generateId(),
    customerId: user.id,
    productId,
    addedAt: new Date().toISOString(),
  });

  return NextResponse.json(item, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await request.json();
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  removeFromWishlist(user.id, productId);
  return NextResponse.json({ ok: true });
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productIds } = await request.json();
  if (!Array.isArray(productIds)) return NextResponse.json({ error: "productIds array required" }, { status: 400 });

  syncWishlist(user.id, productIds);
  return NextResponse.json({ ok: true });
}
