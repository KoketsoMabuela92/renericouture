import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { isAdmin } from "@/lib/auth";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "af-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.S3_BUCKET!;
const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL;

export async function POST(request: NextRequest) {
  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { filename, contentType } = await request.json();

  if (!BUCKET) {
    return NextResponse.json({ error: "S3 not configured" }, { status: 500 });
  }

  const key = `products/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  const publicUrl = CLOUDFRONT_URL
    ? `${CLOUDFRONT_URL.replace(/\/$/, "")}/${key}`
    : `https://${BUCKET}.s3.amazonaws.com/${key}`;

  return NextResponse.json({ uploadUrl, publicUrl, key });
}
