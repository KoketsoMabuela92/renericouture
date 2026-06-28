import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { generateId, slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const q = searchParams.get("q");
  const all = searchParams.get("all");

  const admin = all === "true" ? await isAdmin() : false;
  let products = admin ? getProducts() : getProducts().filter((p) => p.active);

  if (category) {
    products = products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }
  if (featured === "true") {
    products = products.filter((p) => p.featured);
  }
  if (q) {
    const query = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const product = createProduct({
      id: generateId(),
      slug: slugify(body.name),
      images: body.images || [],
      sizes: body.sizes || [],
      colors: body.colors || [],
      tags: body.tags || [],
      featured: body.featured || false,
      active: body.active !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...body,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
