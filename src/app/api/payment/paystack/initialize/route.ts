import { NextRequest, NextResponse } from "next/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(request: NextRequest) {
  const { email, amount, metadata } = await request.json();

  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: "Paystack not configured" }, { status: 500 });
  }

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100),
      currency: "ZAR",
      metadata,
    }),
  });

  const data = await res.json();

  if (!data.status) {
    return NextResponse.json({ error: data.message }, { status: 400 });
  }

  return NextResponse.json({
    access_code: data.data.access_code,
    reference: data.data.reference,
  });
}
