export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function POST(req: Request) {
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
      userId, // C'est cet ID qui est potentiellement rejeté par PostgreSQL
      type,
      street: data.street || "Non renseigné",
      number: data.number || null,
      zip: data.zip || "00000",
      city: data.city || "Non renseigné",
      country: data.country || "Non renseigné",
      phone: data.phone || null,
    });

    // TEST D'ÉCRITURE DIRECT : On enlève la transaction globale pour voir quelle ligne bloque précisément
    try {
      await prisma.address.create({
        data: cleanData(billing, "billing")
      });
    } catch (billingError: any) {
      console.error("🔴 ERREUR FACTURATION :", billingError.message);
      return NextResponse.json({ 
        error: "Supabase a rejeté l'adresse de facturation.", 
        details: billingError.message,
        code: billingError.code // Code d'erreur Prisma (ex: P2003 violation de clé)
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
