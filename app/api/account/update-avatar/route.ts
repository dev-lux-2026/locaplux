import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

// Initialisation directe du client Supabase officiel pour la gestion du Storage (Buckets)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(req: Request) {
  try {
    // 1. Authentification : vérification de la session utilisateur
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // 2. Extraction du fichier binaire envoyé via FormData
    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    // Convertir le fichier en ArrayBuffer / Buffer pour Supabase Storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Générer un nom de fichier unique et sécurisé (ex: userId-timestamp.png)
    const fileExt = file.name.split(".").pop();
    const fileName = `${session.user.id || "avatar"}-${Date.now()}.${fileExt}`;

    // 3. Téléversement physique dans le bucket public "avatars" de Supabase
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("avatars")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("🔴 Erreur Supabase Storage :", uploadError);
      return NextResponse.json({ error: "Échec du stockage de l'image" }, { status: 500 });
    }

    // 4. Construction de l'URL publique officielle de l'image stockée
    const { data: linkData } = supabaseAdmin.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const publicUrl = linkData.publicUrl;

    // 5. Sauvegarde de l'URL de l'avatar dans la table User via Prisma
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        image: publicUrl,
        avatar: publicUrl,
      },
    });

    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error("🔴 CRASH ROUTE API UPDATE-AVATAR :", error);
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
  }
}
