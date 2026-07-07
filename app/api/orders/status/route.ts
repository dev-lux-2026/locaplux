import { prisma } from "@/lib/prisma";
import { handleOrderStatusChange } from "@/lib/events";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Seuls admin OU partenaire propriétaire peuvent modifier une commande
    if (!session || !["admin", "partner"].includes(session.user?.role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { orderId, newStatus } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        partner: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    // Si partenaire : vérifier qu'il est bien propriétaire de la commande
    if (session.user.role === "partner" && session.user.id !== order.partnerId) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const previousStatus = order.status;

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      include: {
        user: true,
        partner: true,
      },
    });

    if (previousStatus !== newStatus) {
      await handleOrderStatusChange(updatedOrder, previousStatus);
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Erreur update order status:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
