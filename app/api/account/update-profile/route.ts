import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Ajustez le chemin vers vos authOptions si nécessaire
import { prisma } from "@/lib/prisma"; // Ajustez le chemin vers votre instance Prisma

export async function POST(req: Request) {
  try {
    // 1. Sécurisation : On vérifie que l'utilisateur est bien connecté
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }

    // 2. Récupération des données envoyées par le formulaire du profil
    const body = await req.json();
    const {
      phone,
      address,
      postal,
      city,
      country,
      shippingAddress,
      shippingPostal,
      shippingCity,
      shippingCountry,
    } = body;

    // 3. Mise à jour atomique et sécurisée dans Supabase via Prisma
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        phone: phone || null,
        address: address || null,
        postal: postal || null,
        city: city || null,
        country: country || "France",
        // Utilisation de champs optionnels ou replis si vides
        shippingAddress: shippingAddress || null,
        shippingPostal: shippingPostal || null,
        shippingCity: shippingCity || null,
        shippingCountry: shippingCountry || "France",
      },
    });

    // 4. Succès
    return NextResponse.json({
      success: true,
      message: "Profil mis à jour avec succès dans Supabase.",
      user: {
        phone: updatedUser.phone,
        address: updatedUser.address,
        postal: updatedUser.postal,
        city: updatedUser.city,
        country: updatedUser.country,
        shippingAddress: updatedUser.shippingAddress,
        shippingPostal: updatedUser.shippingPostal,
        shippingCity: updatedUser.shippingCity,
        shippingCountry: updatedUser.shippingCountry,
      },
    });

  } catch (error: any) {
    console.error("🔴 CRASH ROUTE API UPDATE-PROFILE :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue lors de la mise à jour." },
      { status: 500 }
    );
  }
}
