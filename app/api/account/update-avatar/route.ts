import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

// Initialisation du client Supabase pour le Storage public
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(req: Request) {
  try {
    // 1. Authentification stricte via la session Next-Auth
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // 2. Récupération du fichier image binaire
    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Nettoyage du nom de fichier pour éviter les caractères spéciaux
    const fileExt = file.name.split(".").pop() || "png";
    const cleanEmail = session.user.email.replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `${cleanEmail}-${Date.now()}.${fileExt}`;

    // 3. Envoi physique dans votre Bucket public Supabase "avatars"
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

    // 4. Récupération de l'URL publique de l'image
    const { data: linkData } = supabaseAdmin.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const publicUrl = linkData.publicUrl;

    // 5. Écriture MongoDB via Prisma indexée de manière sécurisée sur l'EMAIL (Source de vérité)
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        image: publicUrl,
        avatar: publicUrl,
      },
    });

    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error: any) {
    console.error("🔴 CRASH COMPLET ROUTE API UPDATE-AVATAR :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
