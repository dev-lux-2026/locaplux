import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const partner = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!partner || partner.role !== "partner") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  // Récupérer tous les items vendus par ce partenaire
  const items = await prisma.orderItem.findMany({
    where: {
      order: {
        partnerId: partner.id,
        status: { not: "cancelled" }, // On exclut les commandes annulées
      },
    },
    include: {
      product: true,
      order: true,
    },
  });

  // Regroupement par produit
  const grouped = {};

  for (const item of items) {
    const pid = item.productId;

    if (!grouped[pid]) {
      grouped[pid] = {
        productId: pid,
        productName: item.product.name,
        productSlug: item.product.slug,
        productPrice: item.product.price,
        stock: item.product.stock,
        active: item.product.active,
        totalQuantity: 0,
        totalRevenue: 0,
        orders: new Set(),
        lastSale: null,
      };
    }

    grouped[pid].totalQuantity += item.quantity;
    grouped[pid].totalRevenue += item.quantity * item.price;
    grouped[pid].orders.add(item.orderId);

    const saleDate = new Date(item.order.createdAt);
    if (!grouped[pid].lastSale || saleDate > grouped[pid].lastSale) {
      grouped[pid].lastSale = saleDate;
    }
  }

  // Convertir Set → number
  const result = Object.values(grouped).map((p: any) => ({
    ...p,
    ordersCount: p.orders.size,
    orders: undefined,
  }));

  return NextResponse.json(result);
}
