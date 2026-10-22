export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  // ✅ Accepte "q" ou "query" pour éviter tout conflit entre les composants
  const q = searchParams.get("q") || searchParams.get("query");
  const categoryId = searchParams.get("category");

  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  const query = q.trim();

  // Construction dynamique des filtres de recherche Prisma
  const whereClause: any = {
    active: true,
    status: "approved",
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { category: { name: { contains: query, mode: "insensitive" } } },
      { condition: { contains: query, mode: "insensitive" } },
      { damage_type: { contains: query, mode: "insensitive" } },
    ],
  };

  // ✅ Intégration du filtre par catégorie si l'utilisateur en a choisi une
  if (categoryId) {
    whereClause.categoryId = categoryId;
  }

  try {
    const products = await prisma.product.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        images: true,
        prix_locaplux: true,
        prix_normal: true,
        condition: true,
        description: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { createdAt: "desc" },
      ],
      take: 30,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Erreur lors de la recherche Prisma :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
