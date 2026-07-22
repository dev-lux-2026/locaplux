import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const category = await prisma.category.findUnique({
    where: { id: Number(params.id) },
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

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { name, validated } = await req.json();

  const updated = await prisma.category.update({
    where: { id: Number(params.id) },
    data: {
      name,
      validated,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

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
