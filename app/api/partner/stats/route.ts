import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(req) {
  const session = await getServerSession();

  if (!session || session.user.role !== "partner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const partnerId = session.user.id;

  const products = await prisma.product.count({
    where: { partnerId },
  });

  const orders = await prisma.order.count({
    where: { partnerId },
  });

  const revenue = await prisma.order.aggregate({
    where: { partnerId },
    _sum: { total: true },
  });

  return NextResponse.json({
    products,
    orders,
    revenue: revenue._sum.total || 0,
  });
}
