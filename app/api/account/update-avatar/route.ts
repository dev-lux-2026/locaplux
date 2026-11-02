import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    console.log("=== 🔍 EXÉCUTION API AVATAR LOCAPLUX ===");

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    // Récupération et nettoyage strict des variables d'environnement
    const supabaseUrl = "https://supabase.co";
    const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim();

    if (!supabaseKey) {
      return NextResponse.json({ error: "La clé secrète de stockage est introuvable." }, { status: 500 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBlob = new Blob([arrayBuffer], { type: file.type });

    const fileExt = file.name.split(".").pop() || "png";
    const cleanEmail = session.user.email.replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `${cleanEmail}-${Date.now()}.${fileExt}`;

    // Configuration optimale pour les fonctions serverless Vercel
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("avatars")
      .upload(fileName, fileBlob, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("🔴 Erreur retournée par le stockage Supabase :", uploadError.message);
      return NextResponse.json({ error: `Erreur stockage : ${uploadError.message}` }, { status: 500 });
    }

    const { data: linkData } = supabaseAdmin.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const publicUrl = linkData?.publicUrl;
    if (!publicUrl) {
      return NextResponse.json({ error: "Génération de l'URL publique impossible." }, { status: 500 });
    }

    // Sauvegarde du lien dans Postgres via Prisma
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        image: publicUrl,
        avatar: publicUrl,
      },
    });

    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error: any) {
    console.error("🔴 EXCEPTION CAPTURÉE :", error?.message || error);
    return NextResponse.json({ error: `Une erreur est survenue : ${error?.message || "Traitement interrompu"}` }, { status: 500 });
  }
}
