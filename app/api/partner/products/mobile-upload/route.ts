import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { createClient } from "@supabase/supabase-js";
import {
  inferCategoryFromImageTags,
} from "@/lib/autoCategory";

// Client Supabase côté serveur
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ service role obligatoire pour écrire dans KV
);

/* ------------------------------------------------------ */
/* POST — Upload depuis mobile + IA catégorie              */
/* ------------------------------------------------------ */
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const session = form.get("session") as string | null;

    if (!file || !session) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    /* ------------------------------------------------------ */
    /* 1. Upload Cloudinary                                   */
    /* ------------------------------------------------------ */
    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "mobile-capture",
          resource_type: "image",
          // Active l'auto-tagging Cloudinary si configuré
          // categorization: "google_tagging", // optionnel
          // auto_tagging: 0.6, // optionnel
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        }
      );
      stream.end(buffer);
    });

    const url = result.secure_url;

    /* ------------------------------------------------------ */
    /* 2. Extraction des tags Cloudinary                      */
    /* ------------------------------------------------------ */
    // Cloudinary peut renvoyer les tags dans plusieurs champs selon config
    const tags: string[] =
      result.tags ||
      result.info?.categorization?.google_tagging?.data?.map((t: any) => t.tag) ||
      [];

    /* ------------------------------------------------------ */
    /* 3. IA Locaplux Premium — Catégorie depuis image        */
    /* ------------------------------------------------------ */
    let autoCategoryId = null;

    if (tags.length > 0) {
      const imageIA = inferCategoryFromImageTags(tags);
      autoCategoryId = imageIA.final.categoryId;
    }

    /* ------------------------------------------------------ */
    /* 4. Stockage Supabase KV                                */
    /* ------------------------------------------------------ */
    await supabase
      .from("kv_store")
      .upsert({
        key: `mobile:${session}`,
        value: { url, autoCategoryId },
      });

    return NextResponse.json({ ok: true, url, autoCategoryId });
  } catch (error) {
    console.error("Mobile upload error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l’upload" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------ */
/* GET — Récupération de l'image + catégorie IA            */
/* ------------------------------------------------------ */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const session = searchParams.get("session");

    if (!session) {
      return NextResponse.json({ url: null, autoCategoryId: null });
    }

    const { data } = await supabase
      .from("kv_store")
      .select("value")
      .eq("key", `mobile:${session}`)
      .single();

    return NextResponse.json({
      url: data?.value?.url || null,
      autoCategoryId: data?.value?.autoCategoryId || null,
    });
  } catch (error) {
    console.error("Mobile upload GET error:", error);
    return NextResponse.json(
      { url: null, autoCategoryId: null },
      { status: 500 }
    );
  }
}
