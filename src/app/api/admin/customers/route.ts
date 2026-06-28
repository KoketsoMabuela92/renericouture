import { NextRequest, NextResponse } from "next/server";
import { getCustomers, createCustomer } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { generateId } from "@/lib/utils";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const customers = getCustomers().map(({ passwordHash: _ph, ...c }) => c);
  return NextResponse.json(customers);
}

export async function POST(request: NextRequest) {
  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.email || !body.firstName || !body.lastName || !body.password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const passwordHash = await hashPassword(body.password);
    const customer = createCustomer({
      id: generateId(),
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      passwordHash,
      role: body.role || "customer",
      createdAt: new Date().toISOString(),
    });
    const { passwordHash: _ph, ...safe } = customer;
    return NextResponse.json(safe, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
