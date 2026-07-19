import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { emailOrderStatusUpdate } from "@/lib/emails/order/orderStatusUpdate";

export async function POST(req, context) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const partner = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!partner || partner.role !== "partner") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!order || order.partnerId !== partner.id) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  const { status } = await req.json();

  const allowed = ["shipped", "delivered", "cancelled"];

  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id: params.id },
    data: { status },
    include: { user: true },
  });

  // Email client
  await emailOrderStatusUpdate(
    updated.user.email,
    updated.id,
    status
  );

  return NextResponse.json(updated);
}
