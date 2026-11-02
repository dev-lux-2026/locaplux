import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  console.log("=== 🔬 DEBUT API UPDATE-AVATAR ===");
  try {
    // 1. Contrôle des variables d'environnement
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("🔴 Variables Supabase manquantes dans l'environnement !");
      return NextResponse.json({ error: "Configuration de stockage indisponible." }, { status: 500 });
    }

    // 2. Vérification de la session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.warn("⚠️ Tentative d'accès non autorisée à l'API avatar");
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.log("👤 Utilisateur authentifié :", session.user.email);

    // 3. Réception du FormData
    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      console.warn("⚠️ Aucun fichier détecté dans le FormData payload");
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }
    console.log(`📁 Fichier reçu : ${file.name} (${file.size} octets, type: ${file.type})`);

    // Conversion binaire sécurisée
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExt = file.name.split(".").pop() || "png";
    const cleanEmail = session.user.email.replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `${cleanEmail}-${Date.now()}.${fileExt}`;

    // 4. Initialisation dynamique et isolée du client Supabase
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    console.log(`🚀 Envoi vers le bucket public 'avatars' sous le nom : ${fileName}`);
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("avatars")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("🔴 Erreur physique Supabase Storage :", uploadError);
      return NextResponse.json({ error: `Erreur stockage : ${uploadError.message}` }, { status: 500 });
    }

    // 5. Génération du lien
    const { data: linkData } = supabaseAdmin.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const publicUrl = linkData?.publicUrl;
    if (!publicUrl) {
      console.error("🔴 Échec de génération de l'URL publique par Supabase");
      return NextResponse.json({ error: "Génération du lien échouée." }, { status: 500 });
    }
    console.log("🔗 URL publique générée avec succès :", publicUrl);

    // 6. Mise à jour Prisma
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        image: publicUrl,
        avatar: publicUrl,
      },
    });
    console.log("💾 Base de données mise à jour avec succès via Prisma.");

    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error: any) {
    console.error("🔴 CRASH CRITIQUE SERVEUR UPDATE-AVATAR :", error?.message || error);
    return NextResponse.json({ error: "Erreur interne du traitement." }, { status: 500 });
  }
}
