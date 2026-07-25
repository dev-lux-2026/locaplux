import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,       // ✔ l’acheteur (OrderBuyer)
      partner: true,    // ✔ le partenaire (OrderPartner)
      items: true,      // ✔ les produits de la commande
    },
  });

  return NextResponse.json(orders);
}
