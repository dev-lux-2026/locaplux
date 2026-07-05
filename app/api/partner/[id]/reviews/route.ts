import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const { rating, comment, orderId } = await req.json();

  if (!rating || !orderId) {
    return NextResponse.json(
      { error: "Note et commande obligatoires." },
      { status: 400 }
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
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

  if (order.buyer_id !== user.id) {
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
    .eq("buyer_id", user.id)
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
      buyer_id: user.id,
      order_id: orderId,
      rating,
      comment,
    })
    .select()
    .single();

  if (error) {
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
  const supabase = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase
    .from("partner_reviews")
    .select("id, rating, comment, created_at")
    .eq("partner_id", params.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json(
      { error: "Erreur lors du chargement des avis." },
      { status: 500 }
    );
  }

  const avg =
    data.length > 0
      ? data.reduce((sum, r) => sum + r.rating, 0) / data.length
      : null;

  return NextResponse.json({
    reviews: data,
    averageRating: avg,
    count: data.length,
  });
}
