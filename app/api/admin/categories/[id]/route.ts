import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// ─────────────────────────────────────────────
// GET — Récupérer une catégorie par ID
// ─────────────────────────────────────────────
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: {
      products: {
        select: { id: true, name: true, status: true },
      },
    },
  });

  if (!category) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(category);
}

// ─────────────────────────────────────────────
// PATCH — Mettre à jour une catégorie
// ─────────────────────────────────────────────
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const body = await req.json();

  const {
    name,
    name_fr,
    name_en,
    name_lu,
    root,
    parent,
    active,
    validated,
  } = body;

  const updated = await prisma.category.update({
    where: { id },
    data: {
      name,
      name_fr,
      name_en,
      name_lu,
      root,
      parent,
      active,
      validated,
    },
  });

  return NextResponse.json(updated);
}

// ─────────────────────────────────────────────
// DELETE — Supprimer une catégorie
// ─────────────────────────────────────────────
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  // Vérifier si la catégorie contient des produits
  const count = await prisma.product.count({
    where: { categoryId: id },
  });

  if (count > 0) {
    return NextResponse.json(
      {
        error:
          "Impossible de supprimer une catégorie contenant des produits.",
      },
      { status: 400 }
    );
  }

  await prisma.category.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
