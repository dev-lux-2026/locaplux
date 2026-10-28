export const dynamic = "force-dynamic";
import { NextResponse, type NextRequest } from "next/server"; // ✨ FIX : Import de NextRequest
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) { // ✨ FIX : Remplacement de Request par NextRequest
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "DEBUG: Jeton JWT introuvable dans les cookies." }, { status: 401 });
  }

  // Diagnostic de l'ID transporté par la session
  const userId = (token.id || token.sub) as string; 

  try {
    const body = await req.json();
    const { billing, shipping } = body;

    const cleanData = (data: any, type: string) => ({
      userId, 
      type,
      street: data.street || "Non renseigné",
      number: data.number || null,
      zip: data.zip || "00000",
      city: data.city || "Non renseigné",
      country: data.country || "Non renseigné",
      phone: data.phone || null,
    });

    // TEST D'ÉCRITURE DIRECT : Capture les rejets PostgreSQL précis
    try {
      await prisma.address.create({
        data: cleanData(billing, "billing")
      });
    } catch (billingError: any) {
      console.error("🔴 ERREUR FACTURATION :", billingError.message);
      return NextResponse.json({ 
        error: "Supabase a rejeté l'adresse de facturation.", 
        details: billingError.message,
        code: billingError.code
      }, { status: 500 });
    }

    try {
      await prisma.address.create({
        data: cleanData(shipping, "shipping")
      });
    } catch (shippingError: any) {
      console.error("🔴 ERREUR LIVRAISON :", shippingError.message);
      return NextResponse.json({ 
        error: "Supabase a rejeté l'adresse de livraison.", 
        details: shippingError.message,
        code: shippingError.code
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json({ error: "Erreur traitement payload.", details: error.message }, { status: 500 });
  }
}
