import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const range = searchParams.get("range") ?? "30d";
  const inactive = Number(searchParams.get("inactive") ?? 30);

  const now = new Date();
  let start: Date;

  switch (range) {
    case "24h":
      start = subDays(now, 1);
      break;
    case "7d":
      start = subDays(now, 7);
      break;
    case "30d":
      start = subDays(now, 30);
      break;
    case "6m":
      start = subDays(now, 180);
      break;
    case "12m":
      start = subDays(now, 365);
      break;
    default:
      start = subDays(now, 30);
  }

  // KPIs
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: start }, status: "confirmed" },
    select: { total: true },
  });

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const ordersCount = orders.length;
  const avgOrder = ordersCount > 0 ? revenue / ordersCount : 0;

  const previousStart = subDays(start, start.getTime() - now.getTime());

  const previousOrders = await prisma.order.findMany({
    where: { createdAt: { gte: previousStart, lt: start }, status: "confirmed" },
    select: { total: true },
  });

  const previousRevenue = previousOrders.reduce((s, o) => s + o.total, 0);

  const growth =
    previousRevenue === 0
      ? 100
      : ((revenue - previousRevenue) / previousRevenue) * 100;

  const inactiveDate = subDays(now, inactive);

  const activePartners = await prisma.partner.count({
    where: { lastActivityAt: { gte: inactiveDate } },
  });

  const inactivePartners = await prisma.partner.count({
    where: { lastActivityAt: { lt: inactiveDate } },
  });

  const activeProducts = await prisma.product.count({
    where: { isActive: true },
  });

  const inactiveProducts = await prisma.product.count({
    where: { isActive: false },
  });

  // SalesPerDay
  const salesRaw = await prisma.order.findMany({
    where: { createdAt: { gte: start }, status: "confirmed" },
    select: { total: true, createdAt: true },
  });

  const salesMap = new Map<string, number>();
  for (const o of salesRaw) {
    const d = o.createdAt.toISOString().split("T")[0];
    salesMap.set(d, (salesMap.get(d) ?? 0) + o.total);
  }

  const salesPerDay = Array.from(salesMap.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // OrdersPerDay
  const ordersRaw = await prisma.order.findMany({
    where: { createdAt: { gte: start }, status: "confirmed" },
    select: { createdAt: true },
  });

  const ordersMap = new Map<string, number>();
  for (const o of ordersRaw) {
    const d = o.createdAt.toISOString().split("T")[0];
    ordersMap.set(d, (ordersMap.get(d) ?? 0) + 1);
  }

  const ordersPerDay = Array.from(ordersMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // SalesByCategory
  const categorySalesRaw = await prisma.orderItem.findMany({
    where: {
      order: { createdAt: { gte: start }, status: "confirmed" },
    },
    select: {
      total: true,
      product: { select: { category: { select: { name: true } } } },
    },
  });

  const categoryMap = new Map<string, number>();
  for (const item of categorySalesRaw) {
    const cat = item.product.category?.name ?? "Autres";
    categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + item.total);
  }

  const salesByCategory = Array.from(categoryMap.entries())
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);

  // SalesByPartner
  const partnerSalesRaw = await prisma.orderItem.findMany({
    where: {
      order: { createdAt: { gte: start }, status: "confirmed" },
    },
    select: {
      total: true,
      product: {
        select: {
          partner: { select: { id: true, publicName: true } },
        },
      },
    },
  });

  const partnerMap = new Map<string, number>();
  for (const item of partnerSalesRaw) {
    const name = item.product.partner?.publicName ?? "Inconnu";
    partnerMap.set(name, (partnerMap.get(name) ?? 0) + item.total);
  }

  const salesByPartner = Array.from(partnerMap.entries())
    .map(([partner, value]) => ({ partner, value }))
    .sort((a, b) => b.value - a.value);

  // TopPartners
  const topPartners = salesByPartner.slice(0, 5).map((p, i) => ({
    id: i + 1,
    name: p.partner,
    revenue: p.value,
    orders: 0,
    growth: 0,
    rank: i + 1,
  }));

  // TopCategories
  const topCategories = salesByCategory.slice(0, 5).map((c) => ({
    category: c.category,
    revenue: c.value,
    percentage: revenue === 0 ? 0 : Math.round((c.value / revenue) * 100),
  }));

  // RecentOrders
  const recentOrders = await prisma.order.findMany({
    where: { status: "confirmed" },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      total: true,
      createdAt: true,
      partner: { select: { publicName: true } },
    },
  });

  const recentOrdersFormatted = recentOrders.map((o) => ({
    id: o.id,
    total: o.total,
    createdAt: o.createdAt,
    partner: o.partner?.publicName ?? "Inconnu",
  }));

  // RecentPartners
  const recentPartners = await prisma.partner.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      publicName: true,
      createdAt: true,
      status: true,
    },
  });

  // PartnersBySector
  const partnersFull = await prisma.partner.findMany({
    include: {
      products: { include: { category: true } },
    },
  });

  const partnerSectors: { partnerId: number; sector: string }[] = [];

  for (const p of partnersFull) {
    const counts = new Map<string, number>();

    for (const product of p.products) {
      const cat = product.category?.name ?? "Autres";
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    }

    if (counts.size === 0) {
      partnerSectors.push({ partnerId: p.id, sector: "Autres" });
      continue;
    }

    let topSector = "Autres";
    let topCount = 0;

    for (const [sector, count] of counts.entries()) {
      if (count > topCount) {
        topCount = count;
        topSector = sector;
      }
    }

    partnerSectors.push({ partnerId: p.id, sector: topSector });
  }

  const sectorCounts = new Map<string, number>();
  for (const ps of partnerSectors) {
    sectorCounts.set(ps.sector, (sectorCounts.get(ps.sector) ?? 0) + 1);
  }

  const partnersBySector = Array.from(sectorCounts.entries()).map(
    ([sector, count]) => ({ sector, count })
  );

  return NextResponse.json({
    range,
    inactiveThreshold: inactive,

    kpis: {
      revenue,
      orders: ordersCount,
      avgOrder: Number(avgOrder.toFixed(2)),
      growth: Number(growth.toFixed(2)),
      activePartners,
      inactivePartners,
      activeProducts,
      inactiveProducts,
    },

    salesPerDay,
    ordersPerDay,
    salesByCategory,
    salesByPartner,
    topPartners,
    topCategories,
    heatmap: [],
    recentOrders: recentOrdersFormatted,
    recentPartners,
    partnersBySector,
  });
}
