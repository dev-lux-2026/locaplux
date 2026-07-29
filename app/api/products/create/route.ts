import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const { name, description, price, images, categoryName } = await req.json();

  // 1) Vérifier si la catégorie existe
  let category = await prisma.category.findFirst({
    where: { name: categoryName },
  });

  // 2) Si elle n'existe pas → la créer automatiquement
  if (!category) {
    category = await prisma.category.create({
      data: {
        id: randomUUID(),        // 🔥 obligatoire
        name: categoryName,
        root: categoryName,      // 🔥 obligatoire
        parent: categoryName,    // 🔥 obligatoire
        validated: false,
        active: true,
      },
    });
  }

  // 3) Créer le produit lié à la catégorie
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      images,
      categoryId: category.id,
    },
  });

  return NextResponse.json(product);
}
