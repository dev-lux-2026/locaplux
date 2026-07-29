import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const { name, description, prix_locaplux, images, categoryName } = await req.json();

  // 1) Vérifier si la catégorie existe
  let category = await prisma.category.findFirst({
    where: { name: categoryName },
  });

  // 2) Si elle n'existe pas → la créer automatiquement
  if (!category) {
    category = await prisma.category.create({
      data: {
        id: randomUUID(),
        name: categoryName,
        root: categoryName,
        parent: categoryName,
        validated: false,
        active: true,
      },
    });
  }

  // 3) Créer le produit lié à la catégorie
  const product = await prisma.product.create({
    data: {
      id: randomUUID(),
      name,
      description,
      prix_locaplux,     // 🔥 FIX ICI
      images,
      categoryId: category.id,
      active: true,
      status: "pending",
    },
  });

  return NextResponse.json(product);
}
