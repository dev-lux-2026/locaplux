import { NextResponse } from "next/server";
import { emailProductDisabled } from "@/lib/emails/product/productDisabled";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { to, productId } = await req.json();

    // Récupérer le nom du produit
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

    // Envoyer l'email premium
    await emailProductDisabled(to, product.name);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product email error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
