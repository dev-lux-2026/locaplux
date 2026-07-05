import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const id = Number(params.id);

  const category = await prisma.category.findUnique({
    where: { id },
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

export async function PATCH(req, { params }) {
  const id = Number(params.id);
  const { name, validated } = await req.json();

  const updated = await prisma.category.update({
    where: { id },
    data: {
      name,
      validated,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  const id = Number(params.id);

  // Vérifier si la catégorie contient des produits
  const count = await prisma.product.count({
    where: { categoryId: id },
  });

  if (count > 0) {
    return NextResponse.json(
      { error: "Impossible de supprimer une catégorie contenant des produits" },
      { status: 400 }
    );
  }

  await prisma.category.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
