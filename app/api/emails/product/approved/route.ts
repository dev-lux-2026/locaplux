import { NextResponse } from "next/server";
import { emailProductApproved } from "@/lib/emails/product/productApproved";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { to, productId } = await req.json();

    // Récupérer le produit pour obtenir son nom
    const { data: product, error } = await supabase
      .from("Product")
      .select("name")
      .eq("id", productId)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { success: false, error: "Produit introuvable" },
        { status: 404 }
      );
    }

    await emailProductApproved(to, product.name);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product email error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
