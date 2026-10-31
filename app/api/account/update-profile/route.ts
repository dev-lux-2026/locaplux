import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; 
import { prisma } from "@/lib/prisma"; 

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      phone,
      address,
      postal,
      city,
      country,
    } = body;

    // Mise à jour sur les colonnes exactes de votre modèle User Prisma
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        phone: phone || null,
        address: address || null,
        postal: postal || null,
        city: city || null,
        country: country || "France",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profil mis à jour avec succès dans Supabase.",
      user: {
        phone: updatedUser.phone,
        address: updatedUser.address,
        postal: updatedUser.postal,
        city: updatedUser.city,
        country: updatedUser.country,
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
