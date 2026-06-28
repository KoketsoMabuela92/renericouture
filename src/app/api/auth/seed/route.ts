import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { getCustomerByEmail, createCustomer } from "@/lib/db";

export async function GET() {
  const existing = getCustomerByEmail("admin@renericouture.com");
  if (existing) {
    return NextResponse.json({ message: "Admin already exists" });
  }

  const passwordHash = await hashPassword("admin123");
  createCustomer({
    id: "admin-1",
    email: "admin@renericouture.com",
    firstName: "Admin",
    lastName: "User",
    passwordHash,
    role: "admin",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ message: "Admin user created successfully" });
}
