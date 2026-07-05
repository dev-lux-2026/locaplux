import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { emailOrderNew } from "@/lib/emails/order/orderNew";
import { emailOrderConfirmation } from "@/lib/emails/order/orderConfirmation";
import { emailOrderReceipt } from "@/lib/emails/order/orderReceipt";

import { eventBus } from "@/lib/events/eventBus";
import { rateLimit } from "@/lib/rateLimit";
import { orderCreateSchema } from "@/lib/validation/orders";

import { antiFraudOrder } from "@/lib/security/antiFraud";
import { antiAbuseIP } from "@/lib/security/antiAbuseIP";

export async function POST(req: Request) {
  // --- IP extraction ---
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  // --- Rate Limit Protection ---
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Veuillez patienter une minute." },
      { status: 429 }
    );
  }

  // --- Anti‑abuse IP global ---
  const abuseCheck = antiAbuseIP(ip);
  if (!abuseCheck.ok) {
    return NextResponse.json(
      { error: abuseCheck.reason },
      { status: 429 }
    );
  }
  // -----------------------------

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // --- Anti‑fraude commandes ---
  const fraudCheck = antiFraudOrder(ip, session.user.id);

  if (!fraudCheck.ok) {
    return NextResponse.json(
      { error: fraudCheck.reason },
      { status: 429 }
    );
  }
  // -----------------------------

  // --- Zod Validation ---
  const json = await req.json();
  const parsed = orderCreateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { items } = parsed.data;
  // -----------------------

  // Récupération de l’acheteur
  const buyer = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!buyer) {
    return NextResponse.json(
      { error: "Utilisateur introuvable" },
      { status: 404 }
    );
  }

  // Vérification des produits + calcul total
  const productIds = items.map((i) => i.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { partner: true },
  });

  if (products.length !== items.length) {
    return NextResponse.json(
      { error: "Produit introuvable" },
      { status: 400 }
    );
  }

  // ⚠️ Locaplux = 1 vendeur par commande
  const partner = products[0].partner;

  const total = products.reduce((sum, product) => {
    const item = items.find((i) => i.productId === product.id);
    return sum + product.price * item.quantity;
  }, 0);

  // ⭐ Création de la commande
  const order = await prisma.order.create({
    data: {
      userId: buyer.id,
      partnerId: partner.id,
      total,
      items: {
        create: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: products.find((p) => p.id === i.productId)!.price,
        })),
      },
    },
    include: {
      user: true,
      partner: true,
      items: { include: { product: true } },
    },
  });

  // ⭐⭐ Notification SSE
  eventBus.emit("notification", {
    type: "ORDER_CREATED",
    userId: order.partnerId,
    payload: {
      orderId: order.id,
      total: order.total,
      buyer: order.user.name,
    },
  });

  // ⭐ Création automatique de la conversation
  await prisma.conversation.create({
    data: {
      orderId: order.id,
      buyerId: order.userId,
      partnerId: order.partnerId,
    },
  });

  // Emails premium
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
