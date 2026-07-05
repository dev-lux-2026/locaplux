import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  const { publicId } = await req.json();

  if (!publicId) {
    return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
  }

  await cloudinary.uploader.destroy(publicId);

  return NextResponse.json({ ok: true });
}
