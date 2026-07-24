import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  // Vérification admin (sécurisée pour TypeScript strict)
  const role = session?.user?.role;
  if (role !== "admin") {
    return NextResponse.json(
      { error: "Accès refusé : administrateur requis." },
      { status: 403 }
    );
  }

  // Produits en attente de validation
  const products = await prisma.product.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      stock: true,
      active: true,
      status: true,
      images: true,
      createdAt: true,
      updatedAt: true,

      prix_normal: true,
      prix_locaplux: true,
      prix_achat: true,

      partner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return NextResponse.json(products);
}
