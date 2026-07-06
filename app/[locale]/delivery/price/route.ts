import { NextResponse } from "next/server";
import haversine from "@/app/utils/haversine";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { productId, clientLat, clientLng } = await req.json();

  if (!productId || !clientLat || !clientLng) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // 1) Récupérer le produit + partenaire
  const { data: product, error: productError } = await supabase
    .from("Product")
    .select("id, userId")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // 2) Récupérer le partenaire
  const { data: partner, error: partnerError } = await supabase
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

  if (partnerError || !partner) {
    return NextResponse.json({ error: "Partner not found" }, { status: 404 });
  }

  if (!partner.lat || !partner.lng) {
    return NextResponse.json(
      { error: "Partner has no coordinates" },
      { status: 400 }
    );
  }

  // 3) Calcul distance
  const distanceKm = haversine(
    partner.lat,
    partner.lng,
    clientLat,
    clientLng
  );

  // 4) Vérifier distance max
  if (partner.delivery_max_km && distanceKm > partner.delivery_max_km) {
    return NextResponse.json(
      { error: "Delivery not available for this distance" },
      { status: 400 }
    );
  }

  // 5) Calcul prix
  let price = distanceKm * (partner.delivery_price_per_km || 0.8);

  if (partner.delivery_min_price) {
    price = Math.max(price, partner.delivery_min_price);
  }

  if (partner.delivery_max_price) {
    price = Math.min(price, partner.delivery_max_price);
  }

  return NextResponse.json({
    distanceKm: Number(distanceKm.toFixed(2)),
    price: Number(price.toFixed(2)),
  });
}
