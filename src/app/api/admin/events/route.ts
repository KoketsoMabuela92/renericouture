import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getEvents, createEvent } from "@/lib/db";
import { generateId } from "@/lib/utils";
import { Event } from "@/lib/types";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = getEvents();
  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, date, time, location, imageUrl, active } = body;

  if (!title || !description || !date || !time || !location) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const newEvent: Event = {
    id: generateId(),
    title,
    description,
    date,
    time,
    location,
    imageUrl: imageUrl || undefined,
    active: active !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const created = createEvent(newEvent);
  return NextResponse.json(created, { status: 201 });
}
