import { prisma } from "@/lib/prisma";
import { handleProductStatusChange } from "@/lib/events";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Seul admin peut changer le statut d’un produit
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { productId, newStatus } = await req.json();

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        partner: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    const previousStatus = product.status;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { status: newStatus },
      include: {
        partner: true,
      },
    });

    if (previousStatus !== newStatus) {
      await handleProductStatusChange(updatedProduct, previousStatus);
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Erreur update product status:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
