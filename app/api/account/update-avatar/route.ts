import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    console.log("=== 🔍 SÉCURITÉ INFRASTRUCTURE LOCAPLUX ===");
    
    // Nettoyage strict des variables d'environnement (supprime les espaces et slashs de fin)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, "");
    const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim();

    if (!supabaseUrl || !supabaseKey) {
      console.error("🔴 Clés introuvables après nettoyage");
      return NextResponse.json({ error: "Configuration de stockage indisponible." }, { status: 500 });
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    // 🚀 SÉCURISATION DU BINAIRE : Utilisation d'un Blob standard pour éviter le crash du fetch Node.js
    const arrayBuffer = await file.arrayBuffer();
    const fileBlob = new Blob([arrayBuffer], { type: file.type });

    const fileExt = file.name.split(".").pop() || "png";
    const cleanEmail = session.user.email.replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `${cleanEmail}-${Date.now()}.${fileExt}`;

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    // Envoi du Blob natif
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("avatars")
      .upload(fileName, fileBlob, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("🔴 Erreur Supabase Storage détectée :", uploadError.message);
      return NextResponse.json({ error: `Erreur stockage : ${uploadError.message}` }, { status: 500 });
    }

    const { data: linkData } = supabaseAdmin.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const publicUrl = linkData?.publicUrl;
    if (!publicUrl) {
      return NextResponse.json({ error: "Génération du lien échouée." }, { status: 500 });
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        image: publicUrl,
        avatar: publicUrl,
      },
    });

    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error: any) {
    console.error("🔴 ERREUR CRITIQUE API AVATAR :", error?.message || error);
    return NextResponse.json({ error: "Erreur interne lors du traitement de l'image." }, { status: 500 });
  }
}
