import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: Request) {
  const { name, description, prix_locaplux, images, categoryName, partnerId } =
    await req.json();

  if (!partnerId) {
    return NextResponse.json(
      { error: "partnerId manquant" },
      { status: 400 }
    );
  }

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
      slug: slugify(name),     // 🔥 obligatoire
      description,
      prix_locaplux,
      images,
      categoryId: category.id,
      partnerId,               // 🔥 obligatoire
      active: true,
      status: "pending",
    },
  });

  return NextResponse.json(product);
}
