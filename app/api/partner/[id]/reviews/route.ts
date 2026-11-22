import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { rating, comment, orderId, userId } = await req.json();

  if (!rating || !orderId || !userId) {
    return NextResponse.json(
      { error: "Note, commande et utilisateur obligatoires." },
      { status: 400 }
    );
  }

  // Vérifier que la commande appartient à l'utilisateur
  const { data: order, error: orderError } = await supabase
    .from("Order")
    .select("id, partner_id, buyer_id")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: "Commande introuvable." },
      { status: 404 }
    );
  }

  if (order.buyer_id !== userId) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas noter cette commande." },
      { status: 403 }
    );
  }

  if (order.partner_id !== params.id) {
    return NextResponse.json(
      { error: "Cette commande n’appartient pas à ce partenaire." },
      { status: 400 }
    );
  }

  // Vérifier si un avis existe déjà
  const { data: existing } = await supabase
    .from("partner_reviews")
    .select("id")
    .eq("order_id", orderId)
    .eq("buyer_id", userId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Vous avez déjà laissé un avis pour cette commande." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("partner_reviews")
    .insert({
      partner_id: params.id,
      buyer_id: userId,
      order_id: orderId,
      rating,
      comment,
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur POST /api/partner/[id]/reviews :", error);
    return NextResponse.json(
      { error: "Erreur lors de l’enregistrement de l’avis." },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Variables Supabase manquantes pour /api/partner/[id]/reviews");
    return NextResponse.json({
      reviews: [],
      averageRating: null,
      count: 0,
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("partner_reviews")
    .select("id, rating, comment, created_at")
    .eq("partner_id", params.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Erreur GET /api/partner/[id]/reviews :", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des avis." },
      { status: 500 }
    );
  }

  const rows = Array.isArray(data) ? data : [];
  const validRatings = rows
    .map((r) => Number(r.rating))
    .filter((n) => Number.isFinite(n));

  const avg =
    validRatings.length > 0
      ? validRatings.reduce((sum, n) => sum + n, 0) / validRatings.length
      : null;

  return NextResponse.json({
    reviews: rows,
    averageRating: avg,
    count: rows.length,
  });
}