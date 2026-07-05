import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      items,
      customer: {
        firstName,
        lastName,
        email,
        phone,
        street,
        number,
        postal,
        city,
        country,
      },
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: "Informations client incomplètes" },
        { status: 400 }
      );
    }

    const productIds = items.map((i: any) => i.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { partner: true },
    });

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Produit introuvable : ${item.productId}` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Stock insuffisant pour ${product.name}. Stock actuel : ${product.stock}`,
          },
          { status: 400 }
        );
      }
    }

    // 1 vendeur par commande
    const partner = products[0].partner;

    if (!partner.stripeAccountId) {
      return NextResponse.json(
        { error: "Partenaire non configuré pour les paiements" },
        { status: 400 }
      );
    }

    // Calcul du total et de la commission
    const grossTotal = items.reduce((sum: number, i: any) => {
      const product = products.find((p) => p.id === i.productId)!;
      return sum + product.price * i.quantity;
    }, 0);

    // Commission : 0 si produit gratuit, sinon commissionRate du partenaire
    // (on part du principe que tous les produits de la commande ont le même partenaire)
    const commissionRate =
      products.every((p) => p.isFree) ? 0 : partner.commissionRate ?? 0.12;

    const commissionAmount = Math.round(grossTotal * commissionRate * 100) / 100;
    const partnerAmount = Math.round((grossTotal - commissionAmount) * 100) / 100;

    // Création de la commande (commission stockée pour cohérence)
    const order = await prisma.order.create({
      data: {
        userId: partner.id, // à remplacer par l’acheteur réel plus tard
        partnerId: partner.id,
        total: grossTotal,
        status: "pending",
        commissionRate,
        commissionAmount,
        partnerAmount,
        street,
        number,
        postal,
        city,
        country,
        items: {
          create: items.map((i: any) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: products.find((p) => p.id === i.productId)!.price,
          })),
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      metadata: {
        orderId: order.id,
      },
      line_items: items.map((i: any) => {
        const product = products.find((p) => p.id === i.productId)!;
        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100,
          },
          quantity: i.quantity,
        };
      }),
      payment_intent_data: {
        application_fee_amount: Math.round(commissionAmount * 100),
        transfer_data: {
          destination: partner.stripeAccountId,
        },
      },
      success_url: `${process.env.NEXTAUTH_URL}/success?orderId=${order.id}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
