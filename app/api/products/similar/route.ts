import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing product ID" },
        { status: 400 }
      );
    }

    // Récupérer le produit pour connaître sa catégorie
    const product = await prisma.product.findUnique({
      where: { id },
      select: { categoryId: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 }
      );
    }

    // Produits similaires = même catégorie, sauf lui-même
    const similar = await prisma.product.findMany({
      where: {
        active: true,
        status: "approved",
        categoryId: product.categoryId,
        NOT: { id },
      },
      take: 10,
      select: {
        id: true,
        name: true,
        prix_locaplux: true,
        prix_normal: true,
        images: true,
      },
    });

    return NextResponse.json(similar);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors du chargement des produits similaires." },
      { status: 500 }
    );
  }
}
