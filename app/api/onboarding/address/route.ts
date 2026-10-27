export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  // 1. Récupération de la session utilisateur
  const session = await getServerSession(authOptions);

  // ⚠️ Note : Vérifiez bien que votre lib/auth.ts remplit la propriété session.user.id
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé. Session absente ou expirée." }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await req.json();
    const { billing, shipping } = body;

    // Validation de la présence des objets
    if (!billing || !shipping) {
      return NextResponse.json(
        { error: "Données de facturation ou de livraison manquantes." },
        { status: 400 }
      );
    }

    // Validation back-end des champs obligatoires
    const required = ["street", "zip", "city", "country"];

    for (const field of required) {
      if (!billing[field]) {
        return NextResponse.json(
          { error: `Le champ de facturation '${field}' est obligatoire.` },
          { status: 400 }
        );
      }
      if (!shipping[field]) {
        return NextResponse.json(
          { error: `Le champ de livraison '${field}' est obligatoire.` },
          { status: 400 }
        );
      }
    }

    // 🚀 Utilisation d'une transaction Prisma pour garantir l'intégrité des données
    await prisma.$transaction([
      // Supprimer les anciennes adresses de l'utilisateur
      prisma.address.deleteMany({
        where: { userId },
      }),

      // Créer la nouvelle adresse de facturation
      prisma.address.create({
        data: {
          userId,
          type: "billing",
          street: billing.street,
          number: billing.number || "",
          zip: billing.zip,
          city: billing.city,
          country: billing.country,
          phone: billing.phone || null,
        },
      }),

      // Créer la nouvelle adresse de livraison
      prisma.address.create({
        data: {
          userId,
          type: "shipping",
          street: shipping.street,
          number: shipping.number || "",
          zip: shipping.zip,
          city: shipping.city,
          country: shipping.country,
          phone: shipping.phone || null,
        },
      }),
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("🔴 Erreur lors de l'enregistrement des adresses :", error);
    return NextResponse.json(
      { error: "Erreur interne lors de la sauvegarde." },
      { status: 500 }
    );
  }
}
