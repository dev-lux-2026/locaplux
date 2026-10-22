export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { haversine } from "@/app/utils/haversine";

const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!stripeSecret) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(stripeSecret);

export async function POST(req: Request) {
  // 🔐 Sécurisation : Récupération de l'utilisateur connecté (Acheteur)
  const sessionUser = await getServerSession(authOptions);

  if (!sessionUser?.user?.id) {
    return NextResponse.json({ error: "Non autorisé. Veuillez vous connecter." }, { status: 401 });
  }

  const buyerUserId = sessionUser.user.id;
  const { cart, clientLat, clientLng, customer } = await req.json();

  if (!cart || cart.length === 0) {
    return NextResponse.json({ error: "Panier vide" }, { status: 400 });
  }

  if (!clientLat || !clientLng) {
    return NextResponse.json(
      { error: "Impossible de déterminer votre position" },
      { status: 400 }
    );
  }

  const line_items = [];
  const item = cart;

  // Récupération du produit avec son partnerId
  const product = await prisma.product.findUnique({
    where: { id: item.id },
    select: {
      id: true,
      name: true,
      prix_locaplux: true,
      partnerId: true,
      delivery_available: true,
    }
  });

  if (!product) {
    return NextResponse.json(
      { error: `Produit introuvable : ${item.id}` },
      { status: 404 }
    );
  }

  const productPrice = product.prix_locaplux || 0;

  line_items.push({
    price_data: {
      currency: "eur",
      product_data: {
        name: product.name,
        images: item.images || [],
      },
      unit_amount: Math.round(productPrice * 100),
    },
    quantity: item.quantity,
  });

  let deliveryPrice = 0;
  let distanceKm = 0;

  if (product.delivery_available) {
    const partner = await prisma.user.findUnique({
      where: { id: product.partnerId },
      select: {
        id: true,
        lat: true,
        lng: true,
        delivery_price_per_km: true,
        delivery_min_price: true,
        delivery_max_price: true,
        delivery_max_km: true,
      }
    });

    if (!partner || !partner.lat || !partner.lng) {
      return NextResponse.json(
        { error: "Le partenaire n'a pas d'adresse valide" },
        { status: 400 }
      );
    }

    distanceKm = haversine(
      Number(partner.lat),
      Number(partner.lng),
      clientLat,
      clientLng
    );

    if (partner.delivery_max_km && distanceKm > Number(partner.delivery_max_km)) {
      return NextResponse.json(
        { error: "Livraison impossible pour cette distance" },
        { status: 400 }
      );
    }

    deliveryPrice = distanceKm * Number(partner.delivery_price_per_km || 0.8);

    if (partner.delivery_min_price)
      deliveryPrice = Math.max(deliveryPrice, Number(partner.delivery_min_price));

    if (partner.delivery_max_price)
      deliveryPrice = Math.min(deliveryPrice, Number(partner.delivery_max_price));

    line_items.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: `Livraison (${distanceKm.toFixed(1)} km)`,
        },
        unit_amount: Math.round(deliveryPrice * 100),
      },
      quantity: 1,
    });
  }

  try {
    // ✅ Alignement parfait avec les colonnes de ton modèle "Order" Prisma
    const order = await prisma.order.create({
      data: {
        userId: buyerUserId,          // Lié à l'acheteur connecté
        partnerId: product.partnerId,  // Lié au vendeur
        status: "pending",
        total: Math.round(productPrice + deliveryPrice), // Le total doit être un entier (Int)
        street: customer?.street || null,
        number: customer?.number || null,
        postal: customer?.postal || null,
        city: customer?.city || null,
        country: customer?.country || null,
      }
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (orderError) {
    console.error(orderError);
    return NextResponse.json(
      { error: "Impossible de créer la commande" },
      { status: 500 }
    );
  }
}
