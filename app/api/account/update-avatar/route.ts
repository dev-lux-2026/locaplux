import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

// 🚀 IMPÉRATIF POUR VERCEL : Force la route à s'exécuter de manière dynamique à chaque requête
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Configuration de stockage indisponible." }, { status: 500 });
    }

    // 🔐 Récupération sécurisée de la session
    const session = await getServerSession(authOptions);
    
    // Si la session est vide (problème de cookie en production), on renvoie une erreur propre sans crasher
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Authentification requise. Veuillez vous déconnecter puis vous reconnecter." }, 
        { status: 401 }
      );
    }

    // Extraction du fichier image binaire
    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExt = file.name.split(".").pop() || "png";
    const cleanEmail = session.user.email.replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `${cleanEmail}-${Date.now()}.${fileExt}`;

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("avatars")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: `Erreur stockage : ${uploadError.message}` }, { status: 500 });
    }

    const { data: linkData } = supabaseAdmin.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const publicUrl = linkData?.publicUrl;
    if (!publicUrl) {
      return NextResponse.json({ error: "Génération du lien échouée." }, { status: 500 });
    }

    // Mise à jour MongoDB via Prisma
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        image: publicUrl,
        avatar: publicUrl,
      },
    });

    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error: any) {
    console.error("🔴 ERREUR CRITIQUE API AVATAR :", error);
    return NextResponse.json({ error: "Erreur interne lors du traitement de l'image." }, { status: 500 });
  }
}
