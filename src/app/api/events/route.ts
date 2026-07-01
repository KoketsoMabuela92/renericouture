import { NextResponse } from "next/server";
import { getEvents } from "@/lib/db";

export async function GET() {
  const events = getEvents().filter((e) => e.active);
  return NextResponse.json(events);
}
