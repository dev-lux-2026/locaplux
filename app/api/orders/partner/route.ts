import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Vérifier que l'utilisateur est partenaire
  const partner = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!partner || partner.role !== "partner") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  // Récupérer les commandes reçues
  const orders = await prisma.order.findMany({
    where: { partnerId: partner.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: true } },
      user: true,
    },
  });

  return NextResponse.json(orders);
}
