export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || searchParams.get("query");
  const categoryId = searchParams.get("category");

  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  const query = q.trim();

  // 🧠 ALGORITHME D'IA MAISON : Découpage en fragments (Trigrammes) pour tolérer les fautes
  // Si l'utilisateur écrit "chaisse", cela va chercher "cha", "hai", "ais", "iss", "sse"
  const fragments: string[] = [];
  for (let i = 0; i < query.length - 2; i++) {
    fragments.push(query.substring(i, i + 3));
  }
  
  // Si le mot est trop court pour des trigrammes, on utilise le mot entier
  if (fragments.length === 0) {
    fragments.push(query);
  }

  // Construction des conditions OR dynamiques pour Prisma
  const searchConditions = fragments.map(frag => ({
    name: { contains: frag, mode: "insensitive" as const }
  }));

  // On garde aussi une recherche sur le mot complet dans la description et catégorie pour la pertinence
  const whereClause: any = {
    active: true,
    status: "approved",
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      ...searchConditions // Injection de nos fragments anti-fautes de frappe
    ]
  };

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
      take: 30,
    });

    // 🎯 TRI PAR PERTINENCE : On classe les produits qui contiennent le plus de fragments correspondants
    const sortedProducts = products.sort((a, b) => {
      const scoreA = fragments.filter(f => a.name.toLowerCase().includes(f.toLowerCase())).length;
      const scoreB = fragments.filter(f => b.name.toLowerCase().includes(f.toLowerCase())).length;
      return scoreB - scoreA; // Les plus pertinents en premier
    });

    return NextResponse.json(sortedProducts);
  } catch (error) {
    console.error("Erreur moteur de recherche IA :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
