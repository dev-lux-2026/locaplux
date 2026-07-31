import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) {
    // On évite les recherches inutiles (1 lettre = bruit)
    return NextResponse.json([]);
  }

  const query = q.trim();

  const products = await prisma.product.findMany({
    where: {
      active: true,
      status: "approved",

      OR: [
        // Recherche dans le nom
        { name: { contains: query, mode: "insensitive" } },

        // Recherche dans la description
        { description: { contains: query, mode: "insensitive" } },

        // Recherche dans la catégorie
        { category: { name: { contains: query, mode: "insensitive" } } },

        // Recherche dans l’état / condition
        { condition: { contains: query, mode: "insensitive" } },

        // Recherche dans les types de dommages
        { damage_type: { contains: query, mode: "insensitive" } },
      ],
    },

    select: {
      id: true,
      name: true,
      slug: true,
      images: true,
      prix_locaplux: true,
      prix_normal: true,
      condition: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      // ❌ jamais partner ici — anonymat pré-achat
    },

    orderBy: [
      // Priorité aux produits avec images
      { images: "desc" },

      // Priorité aux produits les plus récents
      { createdAt: "desc" },
    ],

    take: 30, // Limite optimisée
  });

  return NextResponse.json(products);
}
