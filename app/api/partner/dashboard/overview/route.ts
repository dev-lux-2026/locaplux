import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "partner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const partnerId = session.user.id;

  const orders = await prisma.order.findMany({
    where: { partnerId, status: "confirmed" },
  });

  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const totalCommission = orders.reduce((s, o) => s + (o.commissionAmount ?? 0), 0);
  const totalPartner = orders.reduce((s, o) => s + (o.partnerAmount ?? 0), 0);
  const avgBasket = orders.length ? Math.round(totalSales / orders.length) : 0;

  return NextResponse.json({
    totalSales,
    totalCommission,
    totalPartner,
    totalOrders: orders.length,
    avgBasket,
  });
}
