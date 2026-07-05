import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

// --- Next.js 14 / Vercel Route Config ---
export const dynamic = "force-dynamic";     // Stripe webhook = dynamique obligatoire
export const runtime = "nodejs";            // Stripe nécessite Node.js runtime
export const preferredRegion = "auto";      // Région automatique
export const maxDuration = 300;             // Permet les webhooks longs

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Buffer helper
async function buffer(readable: ReadableStream<Uint8Array>) {
  const chunks: Uint8Array[] = [];
  const reader = readable.getReader();
  let done = false;
  let value: Uint8Array | undefined;

  while (!done) {
    ({ done, value } = await reader.read());
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  // --- Rate Limit Protection (Stripe Special) ---
  const ip = req.headers.get("x-forwarded-for") || "stripe";

  // Stripe peut envoyer beaucoup d’événements → limite élargie
  const allowed = rateLimit(ip);

  const buf = await buffer(req.body!);
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Invalid signature", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 1) Paiement d'une commande
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderId = session.metadata?.orderId;
    const paymentIntentId = session.payment_intent as string;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        partner: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Mise à jour du stock
    for (const item of order.items) {
      const newStock = item.product.stock - item.quantity;

      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: Math.max(newStock, 0),
          active: newStock > 0,
        },
      });
    }

    // Recalcul du total (hors livraison)
    const recalculatedTotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Recalcul commission
    const commissionRate =
      order.commissionRate ?? order.partner.commissionRate ?? 0.12;

    const commissionAmount =
      order.commissionAmount ??
      Math.round(recalculatedTotal * commissionRate * 100) / 100;

    const partnerAmount =
      order.partnerAmount ??
      Math.round((recalculatedTotal - commissionAmount) * 100) / 100;

    // 🔥 Mise à jour de la commande (LIVRAISON + PAIEMENT)
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "confirmed",
        paidAt: new Date(),
        paymentIntentId,

        // 🔥 AJOUT LIVRAISON
        deliveryPaid: true,
        deliveryConfirmed: true,
        deliveryStatus: "pending_delivery",

        // 🔥 TOTAL PRODUIT (la livraison est déjà stockée dans Supabase)
        total: recalculatedTotal,

        // 🔥 COMMISSION
        commissionRate,
        commissionAmount,
        partnerAmount,
      },
    });

    // Enregistrement de la commission
    await prisma.commission.create({
      data: {
        orderId: updatedOrder.id,
        partnerId: updatedOrder.partnerId,
        commissionRate,
        commissionAmount,
      },
    });

    // Facture par vente
    const vatRate = 0.17;
    const vat = Math.round(commissionAmount * vatRate * 100) / 100;
    const totalInvoice = commissionAmount + vat;

    await prisma.invoice.create({
      data: {
        partnerId: updatedOrder.partnerId,
        type: "commission",
        amount: commissionAmount,
        vat,
        total: totalInvoice,
        createdAt: new Date(),
        paid: true,
        metadata: {
          orderId: updatedOrder.id,
          paymentIntentId,
        },
      },
    });

    return NextResponse.json({ received: true });
  }

  // 2) Abonnements PRO
  if (event.type === "customer.subscription.created") {
    const subscription = event.data.object as any;

    await prisma.user.updateMany({
      where: { email: subscription.customer_email },
      data: { status: "active" },
    });

    return NextResponse.json({ received: true });
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as any;

    await prisma.user.updateMany({
      where: { stripeAccountId: subscription.id },
      data: { status: "paused" },
    });

    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
