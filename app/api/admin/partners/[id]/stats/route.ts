import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✔️ Next.js 15 : params doit être awaited
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // Récupérer toutes les commandes livrées
  const orders = await prisma.order.findMany({
    where: { partnerId: id, status: "delivered" },
    select: { total: true },
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // Récupérer la commission du partenaire
  const partner = await prisma.user.findUnique({
    where: { id },
    select: { commissionRate: true },
  });

  const commissionRate = partner?.commissionRate ?? 0.12;
  const commissionTotal = totalRevenue * commissionRate;

  return NextResponse.json({
    totalRevenue,
    commissionTotal,
    ordersCount: orders.length,
  });
}
