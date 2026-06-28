import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import fs from "fs";
import path from "path";

const SETTINGS_PATH = path.join(process.cwd(), "data", "settings.json");

function readSettings(): Record<string, unknown> {
  if (!fs.existsSync(SETTINGS_PATH)) return {};
  return JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf-8"));
}

function writeSettings(data: Record<string, unknown>) {
  const dir = path.dirname(SETTINGS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(data, null, 2));
}

export async function GET() {
  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(readSettings());
}

export async function PUT(request: NextRequest) {
  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const current = readSettings();
  const updated = { ...current, ...body, updatedAt: new Date().toISOString() };
  writeSettings(updated);
  return NextResponse.json(updated);
}
