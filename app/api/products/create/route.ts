import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
        name: categoryName,
        validated: false, // admin devra valider
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
