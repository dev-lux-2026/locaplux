export const dynamic = "force-dynamic";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.email) {
    return NextResponse.json({ error: "Non autorisé. Jeton ou email absent." }, { status: 401 });
  }

  try {
    // 🚀 RECHERCHE SÉCURISÉE : On trouve le vrai ID utilisateur de production via son email unique
    const dbUser = await prisma.user.findUnique({
      where: { email: token.email },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Utilisateur introuvable en base de données." }, { status: 404 });
    }

    const userId = dbUser.id; // L'ID officiel et valide issu de Supabase
    const body = await req.json();
    const { billing, shipping } = body;

    if (!billing || !shipping) {
      return NextResponse.json({ error: "Données manquantes." }, { status: 400 });
    }

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

    // Écriture définitive et atomique dans Supabase
    await prisma.$transaction([
      existingBilling 
        ? prisma.address.update({ where: { id: existingBilling.id }, data: cleanData(billing, "billing") })
        : prisma.address.create({ data: cleanData(billing, "billing") }),

      existingShipping
        ? prisma.address.update({ where: { id: existingShipping.id }, data: cleanData(shipping, "shipping") })
        : prisma.address.create({ data: cleanData(shipping, "shipping") }),
    ]);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("🔴 Erreur finale écriture adresse :", error);
    return NextResponse.json({ error: "Erreur lors de la sauvegarde.", details: error.message }, { status: 500 });
  }
}