// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import cloudinary from "@/lib/cloudinary";
import { rateLimit } from "@/lib/rateLimit";
import { antiAbuseIP } from "@/lib/security/antiAbuseIP";
import { normalize, inferCategoryUnified } from "@/lib/autoCategory";
import { getImageTags } from "@/lib/vision/getImageTags";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "Trop de requêtes. Veuillez patienter une minute." },
        { status: 429 }
      );
    }

    const abuseCheck = antiAbuseIP(ip);
    if (!abuseCheck.ok) {
      return NextResponse.json(
        { error: abuseCheck.reason },
        { status: 429 }
      );
    }

    const token = await getToken({ req });
    if (!token || token.role !== "partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const partnerId = token.id;

    const formData = await req.formData();
    const name = (formData.get("name") as string) || "";
    const description = (formData.get("description") as string) || "";

    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

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

    // --- Upload Cloudinary (sans transformation) ---
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `partners/${partnerId}/products`,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        }
      );
      stream.end(buffer);
    });

    const imageUrl = uploadResult.secure_url;
    const publicId = uploadResult.public_id;

    // --- IA Vision : tags image ---
    const imageTags = await getImageTags(imageUrl);

    // --- IA : fusion texte + image ---
    const detected = await inferCategoryUnified({
      name,
      description,
      imageTags,
    });

    const finalCategory = detected || {
      category: "Inclassables",
      parent: "Autres",
      root: "Divers",
    };

    const categoryId = normalize(finalCategory.category);

    return NextResponse.json(
      {
        url: imageUrl,          // Image originale
        publicId,
        imageTags,
        autoCategory: {
          id: categoryId,
          category: finalCategory.category,
          parent: finalCategory.parent,
          root: finalCategory.root,
        },
        debug: {
          imageTags,
          detected,
          finalCategory,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: "Upload failed", details: String(err) },
      { status: 500 }
    );
  }
}
