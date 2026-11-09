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
    const dbUser = await prisma.user.findUnique({
      where: { email: token.email },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    }

    const userId = dbUser.id;
    const body = await req.json();
    const { billing, shipping } = body;

    if (!billing) {
      return NextResponse.json({ error: "Données de facturation manquantes." }, { status: 400 });
    }

    // Si shipping n'est pas fourni, on utilise billing par défaut
    const finalShipping = shipping || billing;

    const cleanData = (data: any, type: string) => ({
      userId,
      type,
      street: data.street?.trim() || "Non renseigné",
      number: data.number?.trim() || null,
      zip: data.zip?.trim() || data.postal?.trim() || "00000",
      city: data.city?.trim() || "Non renseigné",
      country: data.country?.trim() || "Luxembourg",
      phone: data.phone?.trim() || null,
    });

    const existingAddresses = await prisma.address.findMany({
      where: { userId },
    });

    const existingBilling = existingAddresses.find(a => a.type === "billing");
    const existingShipping = existingAddresses.find(a => a.type === "shipping");

    // Transactions sécurisées
    const transactions: any[] = [
      // Facturation
      existingBilling 
        ? prisma.address.update({ where: { id: existingBilling.id }, data: cleanData(billing, "billing") })
        : prisma.address.create({ data: cleanData(billing, "billing") }),

      // Livraison
      existingShipping
        ? prisma.address.update({ where: { id: existingShipping.id }, data: cleanData(finalShipping, "shipping") })
        : prisma.address.create({ data: cleanData(finalShipping, "shipping") }),

      // Mise à jour de la table User (pour le profil et les gardes)
      prisma.user.update({
        where: { id: userId },
        data: {
          number: billing.number?.trim() || null,
          street: billing.street?.trim() || "Non renseigné",
          postal: billing.zip?.trim() || billing.postal?.trim() || "00000",
          city: billing.city?.trim() || "Non renseigné",
          country: billing.country?.trim() || "Luxembourg",
          phone: billing.phone?.trim() || null,
        },
      }),
    ];

    await prisma.$transaction(transactions);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("🔴 Erreur mise à jour onboarding :", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour du profil.", details: error.message }, { status: 500 });
  }
}