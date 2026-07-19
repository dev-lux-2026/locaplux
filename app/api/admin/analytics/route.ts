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

  // Active partners (User)
  const activePartners = await prisma.user.count({
    where: {
      role: "partner",
      createdAt: { gte: inactiveDate },
    },
  });

  // Inactive partners (User)
  const inactivePartners = await prisma.user.count({
    where: {
      role: "partner",
      createdAt: { lt: inactiveDate },
    },
  });

  // Products
  const activeProducts = await prisma.product.count({
    where: { active: true },
  });

  const inactiveProducts = await prisma.product.count({
    where: { active: false },
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
      quantity: true,
      price: true,
      product: { select: { category: { select: { name: true } } } },
    },
  });

  const categoryMap = new Map<string, number>();
  for (const item of categorySalesRaw) {
    const cat = item.product.category?.name ?? "Autres";
    const total = item.quantity * item.price;
    categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + total);
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
      quantity: true,
      price: true,
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
    const total = item.quantity * item.price;
    partnerMap.set(name, (partnerMap.get(name) ?? 0) + total);
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

  // RecentPartners (PartnerApplication)
  const recentPartners = await prisma.partnerApplication.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      company: true,
      createdAt: true,
      status: true,
    },
  });

  // PartnersBySector (via Product)
  const products = await prisma.product.findMany({
    include: { category: true },
  });

  const sectorCounts = new Map<string, number>();

  for (const product of products) {
    const sector = product.category?.name ?? "Autres";
    sectorCounts.set(sector, (sectorCounts.get(sector) ?? 0) + 1);
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
