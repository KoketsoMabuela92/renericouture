import { NextRequest, NextResponse } from "next/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
  });

  const data = await res.json();

  if (!data.status || data.data.status !== "success") {
    return NextResponse.json({ error: "Payment not successful" }, { status: 400 });
  }

  return NextResponse.json({
    verified: true,
    amount: data.data.amount / 100,
    reference: data.data.reference,
    email: data.data.customer.email,
  });
}
