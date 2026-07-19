import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const now = new Date();

    // On récupère les boosts actifs
    const boosts = await prisma.boost.findMany({
      where: {
        productId: { not: null },
        createdAt: {
          lte: now,
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: true,
            prix_locaplux: true,
            active: true,
            status: true,
          },
        },
      },
    });

    // On filtre les boosts expirés
    const activeBoosts = boosts.filter((boost) => {
      const endDate = new Date(boost.createdAt);
      endDate.setDate(endDate.getDate() + boost.duration);
      return endDate > now;
    });

    // On extrait les produits valides
    const featuredProducts = activeBoosts
      .map((b) => b.product)
      .filter(
        (p) =>
          p &&
          p.active === true &&
          p.status === "approved" &&
          p.images.length > 0
      )
      .slice(0, 10); // max 10 produits pour le carrousel

    return NextResponse.json(featuredProducts);
  } catch (error) {
    console.error("Erreur featured:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des produits mis en avant." },
      { status: 500 }
    );
  }
}
