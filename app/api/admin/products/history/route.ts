import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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

  // Historique des validations produits
  const history = await prisma.productValidationHistory.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      productId: true,
      adminId: true,
      status: true,
      comment: true,
      createdAt: true,
      product: {
        select: {
          name: true,
          partnerId: true,
        },
      },
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json(history);
}
