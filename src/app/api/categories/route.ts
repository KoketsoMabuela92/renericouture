import { NextRequest, NextResponse } from "next/server";
import { getCategories, createCategory } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { generateId, slugify } from "@/lib/utils";

export async function GET() {
  return NextResponse.json(getCategories());
}

export async function POST(request: NextRequest) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const category = createCategory({
      id: generateId(),
      name: body.name,
      slug: slugify(body.name),
      description: body.description || "",
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
