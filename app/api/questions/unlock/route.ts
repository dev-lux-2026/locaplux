import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Produit requis." }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: "delivered",
        items: { some: { productId } },
      },
      include: { partner: true },
    });

    if (!order) {
      return NextResponse.json({ unlocked: false }, { status: 200 });
    }

    // RGPD : partenaire supprimé / anonymisé
    if (!order.partner) {
      return NextResponse.json({
        unlocked: true,
        partner: null,
      });
    }

    return NextResponse.json({
      unlocked: true,
      partner: {
        name: order.partner.name,
        email: order.partner.email,
        phone: order.partner.phone,
        address: order.partner.address,
      },
    });
  } catch (error) {
    console.error("Erreur API /questions/unlock :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
