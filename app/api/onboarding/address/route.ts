export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await req.json();
    const { billing, shipping } = body;

    if (!billing || !shipping) {
      return NextResponse.json({ error: "Données manquantes." }, { status: 400 });
    }

    const required = ["street", "zip", "city", "country"];
    for (const field of required) {
      if (!billing[field]?.trim() || !shipping[field]?.trim()) {
        return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
      }
    }

    // Formatteur sécurisé pour la base de données
    const cleanData = (data: any, type: string) => ({
      userId,
      type,
      street: data.street.trim(),
      number: data.number?.trim() || null,
      zip: data.zip.trim(),
      city: data.city.trim(),
      country: data.country.trim(),
      phone: data.phone?.trim() || null,
    });

    // 🚀 REQUÊTE ROBUSTE : On cherche si une adresse de ce type existe déjà pour l'utilisateur
    const existingAddresses = await prisma.address.findMany({
      where: { userId },
    });

    const existingBilling = existingAddresses.find(a => a.type === "billing");
    const existingShipping = existingAddresses.find(a => a.type === "shipping");

    await prisma.$transaction([
      // Gestion Facturation (billing)
      existingBilling 
        ? prisma.address.update({ where: { id: existingBilling.id }, data: cleanData(billing, "billing") })
        : prisma.address.create({ data: cleanData(billing, "billing") }),

      // Gestion Livraison (shipping)
      existingShipping
        ? prisma.address.update({ where: { id: existingShipping.id }, data: cleanData(shipping, "shipping") })
        : prisma.address.create({ data: cleanData(shipping, "shipping") }),
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("🔴 Erreur écriture adresse :", error);
    return NextResponse.json({ error: "Erreur lors de la sauvegarde." }, { status: 500 });
  }
}
