import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  // --- Rate Limit Protection ---
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Veuillez patienter une minute." },
      { status: 429 }
    );
  }

  const { orderId } = await req.json();

  if (!orderId) {
    return NextResponse.json(
      { error: "ID de commande manquant" },
      { status: 400 }
    );
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "confirmed", // ⭐ valeur valide de TON enum OrderStatus
      paidAt: new Date(),
    },
  });

  return NextResponse.json(order);
}
