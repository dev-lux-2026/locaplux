import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const partners = await prisma.user.findMany({
    where: { role: "partner" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      status: true,
      createdAt: true,

      // 🔥 Champs essentiels pour la LISTE admin
      publicName: true,
      company: true,
      vat: true,
      vatCheckFailed: true,

      phonePrefix: true,
      phone: true,

      street: true,
      number: true,
      postal: true,
      city: true,
      country: true,

      website: true,

      // Limites gratuites
      freeProductLimit: true,
      freeDaysLimit: true,
      freeUntil: true,

      // Commission personnalisée
      commissionRate: true,

      // Nombre de produits
      _count: { select: { products: true } },
    },
  });

  return NextResponse.json(partners);
}
