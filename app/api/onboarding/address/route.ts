export const dynamic = "force-dynamic";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.email) {
    return NextResponse.json({ error: "Non autorisé. Session absente." }, { status: 401 });
  }

  try {
    // 1. Récupération de l'utilisateur officiel via son email unique
    const dbUser = await prisma.user.findUnique({
      where: { email: token.email },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    }

    const userId = dbUser.id;
    const body = await req.json();
    const { billing, shipping } = body;

    if (!billing || !shipping) {
      return NextResponse.json({ error: "Données de formulaire manquantes." }, { status: 400 });
    }

    // 2. Formatage des données d'adresses
    const cleanData = (data: any, type: string) => ({
      userId,
      type,
      street: data.street?.trim() || "Non renseigné",
      number: data.number?.trim() || null,
      zip: data.zip?.trim() || "00000",
      city: data.city?.trim() || "Non renseigné",
      country: data.country?.trim() || "Non renseigné",
      phone: data.phone?.trim() || null,
    });

    const existingAddresses = await prisma.address.findMany({
      where: { userId },
    });

    const existingBilling = existingAddresses.find(a => a.type === "billing");
    const existingShipping = existingAddresses.find(a => a.type === "shipping");

    // ⚡ EXÉCUTION UNIFIÉE : Écrit dans la table Address ET met à jour la table User
    await prisma.$transaction([
      // Mise à jour ou création de l'adresse de facturation
      existingBilling 
        ? prisma.address.update({ where: { id: existingBilling.id }, data: cleanData(billing, "billing") })
        : prisma.address.create({ data: cleanData(billing, "billing") }),

      // Mise à jour ou création de l'adresse de livraison
      existingShipping
        ? prisma.address.update({ where: { id: existingShipping.id }, data: cleanData(shipping, "shipping") })
        : prisma.address.create({ data: cleanData(shipping, "shipping") }),

      // ✨ ALIGNEMENT SUPABASE : Remplit enfin les colonnes de la table User pour valider l'onboarding
      prisma.user.update({
        where: { id: userId },
        data: {
          address: billing.street?.trim() || "Non renseigné",
          city: billing.city?.trim() || "Non renseigné",
          postal: billing.zip?.trim() || "00000",
          country: billing.country?.trim() || "Non renseigné",
        },
      }),
    ]);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("🔴 Erreur alignement onboarding :", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour du profil.", details: error.message }, { status: 500 });
  }
}
