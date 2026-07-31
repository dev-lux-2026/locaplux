import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID du produit manquant." },
        { status: 400 }
      );
    }

    // On récupère le produit de référence
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product || !product.category) {
      return NextResponse.json([], { status: 200 });
    }

    // On récupère des produits similaires dans la même catégorie
    const similarProducts = await prisma.product.findMany({
      where: {
        id: { not: id },
        categoryId: product.categoryId,
        active: true,
        status: "approved",
        images: { isEmpty: false },
      },
      take: 10,
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        prix_locaplux: true,
      },
    });

    return NextResponse.json(similarProducts);
  } catch (error) {
    console.error("Erreur similar:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des produits similaires." },
      { status: 500 }
    );
  }
}
