export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  // 1. Récupération et validation stricte de la session
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await req.json();
    const { billing, shipping } = body;

    if (!billing || !shipping) {
      return NextResponse.json(
        { error: "Données de facturation ou de livraison manquantes." },
        { status: 400 }
      );
    }

    // Validation des champs obligatoires textuels
    const required = ["street", "zip", "city", "country"];
    for (const field of required) {
      if (!billing[field]?.trim()) {
        return NextResponse.json({ error: `Champs obligatoires manquants (facturation : ${field})` }, { status: 400 });
      }
      if (!shipping[field]?.trim()) {
        return NextResponse.json({ error: `Champs obligatoires manquants (livraison : ${field})` }, { status: 400 });
      }
    }

    // 🚀 NETTOYAGE DES DONNÉES : Sécurise les champs vides pour éviter les plantages Prisma
    const formatAddressData = (data: any, type: "billing" | "shipping") => {
      return {
        userId,
        type,
        street: data.street.trim(),
        // Si le numéro est vide, on envoie null (ou "0" si votre schéma exige un Int strict non-nul)
        number: data.number?.trim() || null, 
        zip: data.zip.trim(),
        city: data.city.trim(),
        country: data.country.trim(),
        // Si le téléphone est vide ou absent, on passe null de manière propre
        phone: data.phone?.trim() || null,
      };
    };

    // ⚡ Exécution de la transaction sécurisée et atomique
    await prisma.$transaction([
      // Supprimer proprement les anciennes adresses existantes pour cet ID utilisateur
      prisma.address.deleteMany({
        where: { userId },
      }),

      // Création de la ligne de facturation
      prisma.address.create({
        data: formatAddressData(billing, "billing"),
      }),

      // Création de la ligne de livraison
      prisma.address.create({
        data: formatAddressData(shipping, "shipping"),
      }),
    ]);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    // 🔬 Capture l'erreur exacte renvoyée par Prisma dans vos logs Vercel pour le diagnostic
    console.error("🔴 ÉCHEC CRITIQUE PRISMA TRANSACTION :", error);
    
    return NextResponse.json(
      { error: "Erreur d'écriture en base de données. Vérifiez le format des champs." },
      { status: 500 }
    );
  }
}
