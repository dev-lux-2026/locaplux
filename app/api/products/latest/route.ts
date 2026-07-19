import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const products = await prisma.product.findMany({
      where: {
        active: true,
        status: "approved",
        images: {
          isEmpty: false, // ✔ au moins une image
        },
        prix_locaplux: {
          not: null, // ✔ prix valide
        },
        category: {
          isNot: null, // ✔ la catégorie doit exister
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      select: {
        id: true,
        name: true,
        description: true,
        prix_locaplux: true,
        prix_normal: true,
        images: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors du chargement des produits." },
      { status: 500 }
    );
  }
}
