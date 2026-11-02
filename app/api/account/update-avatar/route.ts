import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    console.log("=== 🔍 AMÉLIORATION DU TUNNEL HTTP SECURE ===");

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    // Extraction du fichier binaire standardisé en Blob
    const arrayBuffer = await file.arrayBuffer();
    const fileBlob = new Blob([arrayBuffer], { type: file.type });

    const fileExt = file.name.split(".").pop() || "png";
    const cleanEmail = session.user.email.replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `${cleanEmail}-${Date.now()}.${fileExt}`;

    // 🚀 INITIALISATION DU SDK AVEC DÉSACTIVATION DES COOKIES (Recommandé pour Vercel Serverless)
    const supabaseAdmin = createClient(
      "https://supabase.co",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    );

    // Téléversement via le SDK officiel
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("avatars")
      .upload(fileName, fileBlob, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("🔴 Erreur interne du SDK Supabase :", uploadError.message);
      return NextResponse.json({ error: `Erreur stockage : ${uploadError.message}` }, { status: 500 });
    }

    // Récupération du lien public
    const { data: linkData } = supabaseAdmin.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const publicUrl = linkData?.publicUrl;
    if (!publicUrl) {
      return NextResponse.json({ error: "Génération du lien échouée." }, { status: 500 });
    }

    // Enregistrement dans PostgreSQL via Prisma
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        image: publicUrl,
        avatar: publicUrl,
      },
    });

    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error: any) {
    console.error("🔴 ERREUR TUNNEL VERCEL :", error?.message || error);
    return NextResponse.json({ error: `Erreur de connexion réseau : ${error?.message || "fetch failed"}` }, { status: 500 });
  }
}
