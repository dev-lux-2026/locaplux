import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  MARKETPLACE_COMMISSION_RATE,
  MARKETPLACE_FREE_PRODUCTS_LIMIT,
  MARKETPLACE_FREE_DAYS_LIMIT,
} from "@/lib/marketplaceConfig";

export async function GET(req) {
  const products = await prisma.product.count();
  const partners = await prisma.user.count({ where: { role: "partner" } });
  const users = await prisma.user.count({ where: { role: "user" } });
  const orders = await prisma.order.count();

  const revenueData = await prisma.order.findMany({
    where: { status: "delivered" },
    select: { total: true },
  });

  const grossRevenue = revenueData.reduce((sum, o) => sum + o.total, 0);
  const commissionTotal = grossRevenue * MARKETPLACE_COMMISSION_RATE;

  return NextResponse.json({
    products,
    partners,
    users,
    orders,
    grossRevenue,
    commissionTotal,
    commissionRate: MARKETPLACE_COMMISSION_RATE,
    freeProductsLimit: MARKETPLACE_FREE_PRODUCTS_LIMIT,
    freeDaysLimit: MARKETPLACE_FREE_DAYS_LIMIT,
  });
}
