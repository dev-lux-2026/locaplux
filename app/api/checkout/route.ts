import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { haversine } from "@/app/utils/haversine";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
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

  // On suppose 1 seul produit par commande (comme Locaplux)
  const item = cart[0];

  // 1) Récupérer le produit
  const { data: product } = await supabase
    .from("Product")
    .select("id, name, price, userId, delivery_available")
    .eq("id", item.id)
    .single();

  if (!product) {
    return NextResponse.json(
      { error: `Produit introuvable : ${item.id}` },
      { status: 404 }
    );
  }

  // 2) Ajouter le produit au checkout
  line_items.push({
    price_data: {
      currency: "eur",
      product_data: {
        name: product.name,
        images: item.images || [],
      },
      unit_amount: Math.round(product.price * 100),
    },
    quantity: item.quantity,
  });

  let deliveryPrice = 0;
  let distanceKm = 0;

  // 3) Si livraison → calculer prix
  if (product.delivery_available) {
    const { data: partner } = await supabase
      .from("User")
      .select(`
        id,
        lat,
        lng,
        delivery_price_per_km,
        delivery_min_price,
        delivery_max_price,
        delivery_max_km
      `)
      .eq("id", product.userId)
      .single();

    if (!partner || !partner.lat || !partner.lng) {
      return NextResponse.json(
        { error: "Le partenaire n'a pas d'adresse valide" },
        { status: 400 }
      );
    }

  // 4) Distance
distanceKm = haversine(
  partner.lat,
  partner.lng,
  clientLat,
  clientLng
);

    if (partner.delivery_max_km && distanceKm > partner.delivery_max_km) {
      return NextResponse.json(
        { error: "Livraison impossible pour cette distance" },
        { status: 400 }
      );
    }

    // 5) Prix livraison
    deliveryPrice =
      distanceKm * (partner.delivery_price_per_km || 0.8);

    if (partner.delivery_min_price)
      deliveryPrice = Math.max(deliveryPrice, partner.delivery_min_price);

    if (partner.delivery_max_price)
      deliveryPrice = Math.min(deliveryPrice, partner.delivery_max_price);

    // 6) Ajouter la livraison comme line_item Stripe
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

  // 7) Créer la commande dans Supabase AVANT Stripe
  const { data: order, error: orderError } = await supabase
    .from("Order")
    .insert({
      partnerId: product.userId,
      status: "pending",
      total: product.price + deliveryPrice,

      // Infos client
      customerFirstName: customer?.firstName || null,
      customerLastName: customer?.lastName || null,
      customerEmail: customer?.email || null,
      customerPhone: customer?.phone || null,
      customerStreet: customer?.street || null,
      customerNumber: customer?.number || null,
      customerPostal: customer?.postal || null,
      customerCity: customer?.city || null,
      customerCountry: customer?.country || null,

      // Livraison
      deliveryPrice,
      deliveryDistance: distanceKm,
      deliveryMode: product.delivery_available ? "delivery" : "pickup",
      clientLat,
      clientLng,
    })
    .select()
    .single();

  if (orderError) {
    console.error(orderError);
    return NextResponse.json(
      { error: "Impossible de créer la commande" },
      { status: 500 }
    );
  }

  // 8) Créer la session Stripe
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    metadata: {
      orderId: order.id, // 🔥 essentiel pour le webhook
    },
  });

  return NextResponse.json({ url: session.url });
}
