import { NextRequest, NextResponse } from "next/server";
import { updateCustomer, deleteCustomer } from "@/lib/db";
import { isAdmin, hashPassword } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const updates: Record<string, string> = {};
  if (body.firstName) updates.firstName = body.firstName;
  if (body.lastName) updates.lastName = body.lastName;
  if (body.email) updates.email = body.email;
  if (body.role) updates.role = body.role;
  if (body.password) updates.passwordHash = await hashPassword(body.password);

  const updated = updateCustomer(id, updates);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { passwordHash: _ph, ...safe } = updated;
  return NextResponse.json(safe);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const ok = deleteCustomer(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
