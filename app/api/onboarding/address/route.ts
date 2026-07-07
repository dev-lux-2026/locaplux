import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();

  const { billing, shipping } = body;

  // Validation back-end
  const required = ["street", "zip", "city", "country"];

  for (const field of required) {
    if (!billing[field]) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants (facturation)" },
        { status: 400 }
      );
    }
  }

  for (const field of required) {
    if (!shipping[field]) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants (livraison)" },
        { status: 400 }
      );
    }
  }

  // Supprimer anciennes adresses (optionnel mais propre)
  await prisma.address.deleteMany({
    where: { userId },
  });

  // Créer adresse de facturation
  await prisma.address.create({
    data: {
      userId,
      type: "billing",
      street: billing.street,
      number: billing.number,
      zip: billing.zip,
      city: billing.city,
      country: billing.country,
      phone: billing.phone,
    },
  });

  // Créer adresse de livraison
  await prisma.address.create({
    data: {
      userId,
      type: "shipping",
      street: shipping.street,
      number: shipping.number,
      zip: shipping.zip,
      city: shipping.city,
      country: shipping.country,
      phone: shipping.phone,
    },
  });

  return NextResponse.json({ success: true });
}
