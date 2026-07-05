import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import cloudinary from "@/lib/cloudinary";

import { rateLimit } from "@/lib/rateLimit";
import { antiAbuseIP } from "@/lib/security/antiAbuseIP";
import { productImageUploadSchema } from "@/lib/validation/upload";
import { detectCategoryIdFromTags } from "@/lib/categories/categoryAutoDetect";

export async function POST(req: Request) {
  try {
    // --- IP extraction ---
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    // --- Rate Limit Protection ---
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "Trop de requêtes. Veuillez patienter une minute." },
        { status: 429 }
      );
    }

    // --- Anti‑abuse IP global ---
    const abuseCheck = antiAbuseIP(ip);
    if (!abuseCheck.ok) {
      return NextResponse.json(
        { error: abuseCheck.reason },
        { status: 429 }
      );
    }

    // --- Auth partenaire ---
    const token = await getToken({ req });

    if (!token || token.role !== "partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const partnerId = token.id;

    // --- Lecture du formData ---
    const formData = await req.formData();

    // --- Validation textuelle ---
    const textFields: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") textFields[key] = value;
    });

    const parsed = productImageUploadSchema.safeParse(textFields);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid fields", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // --- Fichier ---
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 10 Mo)" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Format non supporté (JPEG, PNG, WEBP uniquement)" },
        { status: 400 }
      );
    }

    // --- Upload Cloudinary avec auto-tagging ---
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `partners/${partnerId}/products`,
          resource_type: "image",
          auto_tagging: 0.7, // 🔥 active la détection d’objets Cloudinary
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        }
      );
      stream.end(buffer);
    });

    // 🔥 Tags Cloudinary
    const tags = result.tags || [];

    // 🔥 Détection de catégorie via tags
    const autoCategoryId = await detectCategoryIdFromTags(tags);

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      tags,
      autoCategoryId, // 🔥 envoyé au front
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: "Upload failed", details: String(err) },
      { status: 500 }
    );
  }
}
