import { NextRequest, NextResponse } from "next/server";
import { hashPassword, createToken } from "@/lib/auth";
import { createCustomer, getCustomerByEmail } from "@/lib/db";
import { generateId } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existing = getCustomerByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const customer = createCustomer({
      id: generateId(),
      email,
      firstName,
      lastName,
      passwordHash,
      role: "customer",
      createdAt: new Date().toISOString(),
    });

    const token = createToken(customer);

    const response = NextResponse.json({
      user: { id: customer.id, email: customer.email, firstName, lastName, role: customer.role },
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
