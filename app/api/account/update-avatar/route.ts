import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// 🚀 REQUÊTAGE DIRECT : Utilisation de la vraie URL physique pour bypasser les blocages réseau de Vercel
const REAL_SUPABASE_URL = "https://vercel.app"; // Remplacez par l'URL exacte de votre projet si nécessaire

export async function POST(req: Request) {
  try {
    console.log("=== 🔍 AMÉLIORATION DU TUNNEL HTTP SECURE ===");
    
    // Récupération de la clé service_role stockée en toute sécurité sur Vercel
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (!supabaseKey) {
      console.error("🔴 Clé de stockage introuvable dans les variables d'environnement.");
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

    const arrayBuffer = await file.arrayBuffer();
    const fileExt = file.name.split(".").pop() || "png";
    const cleanEmail = session.user.email.replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `${cleanEmail}-${Date.now()}.${fileExt}`;

    // Construction de l'URL physique d'envoi direct vers l'API REST de stockage Supabase
    const uploadUrl = `https://supabase.co{fileName}`;
    
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${supabaseKey}`,
        "apikey": supabaseKey,
        "Content-Type": file.type,
      },
      body: arrayBuffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("🔴 Supabase Rejection:", errorText);
      return NextResponse.json({ error: `Supabase a refusé l'accès : ${errorText}` }, { status: 500 });
    }

    const publicUrl = `https://supabase.co{fileName}`;

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
