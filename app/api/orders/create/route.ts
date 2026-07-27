import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { emailOrderNew } from "@/lib/emails/order/orderNew";
import { emailOrderConfirmation } from "@/lib/emails/order/orderConfirmation";
import { emailOrderReceipt } from "@/lib/emails/order/orderReceipt";

import { eventBus } from "@/lib/events/eventBus";
import { rateLimit } from "@/lib/rateLimit";
import { orderCreateSchema } from "@/lib/validation/orders";

import { antiFraudOrder } from "@/lib/security/antiFraud";
import { antiAbuseIP } from "@/lib/security/antiAbuseIP";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Veuillez patienter une minute." },
      { status: 429 }
    );
  }

  const abuseCheck = antiAbuseIP(ip);
  if (!abuseCheck.ok) {
    return NextResponse.json(
      { error: abuseCheck.reason },
      { status: 429 }
    );
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email || !session.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = session.user.id;

  const fraudCheck = antiFraudOrder(ip, userId);
  if (!fraudCheck.ok) {
    return NextResponse.json(
      { error: fraudCheck.reason },
      { status: 429 }
    );
  }

  const json = await req.json();
  const parsed = orderCreateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { items } = parsed.data;

  const buyer = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!buyer) {
    return NextResponse.json(
      { error: "Utilisateur introuvable" },
      { status: 404 }
    );
  }

  const productIds = items.map((i) => i.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      prix_locaplux: true,
      partner: true,
    },
  });

  if (products.length !== items.length) {
    return NextResponse.json(
      { error: "Produit introuvable" },
      { status: 400 }
    );
  }

  const partner = products[0].partner;

  const total = products.reduce((sum, product) => {
    const item = items.find((i) => i.productId === product.id);
    if (!item) return sum;

    return sum + (product.prix_locaplux ?? 0) * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      id: crypto.randomUUID(), // ⭐ FIX UUID REQUIRED
      userId: buyer.id,
      partnerId: partner.id,
      total,
      items: {
        create: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price:
            products.find((p) => p.id === i.productId)?.prix_locaplux ?? 0,
        })),
      },
    },
    include: {
      user: true,
      partner: true,
      items: { include: { product: true } },
    },
  });

  eventBus.emit("notification", {
    type: "ORDER_CREATED",
    userId: order.partnerId,
    payload: {
      orderId: order.id,
      total: order.total,
      buyer: order.user.name,
    },
  });

  await prisma.conversation.create({
    data: {
      orderId: order.id,
      buyerId: order.userId,
      partnerId: order.partnerId,
    },
  });

  const buyerEmail = order.user.email;
  const partnerEmail = order.partner.email;

  if (partnerEmail) {
    await emailOrderNew(partnerEmail, order.id);
  }

  if (buyerEmail) {
    await emailOrderConfirmation(buyerEmail, order.id);
    await emailOrderReceipt(buyerEmail, order.id, order.total);
  }

  return NextResponse.json(order);
}
