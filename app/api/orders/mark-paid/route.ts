import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  // --- Rate Limit Protection ---
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  // Ici on peut être encore plus strict : 5 requêtes/minute max
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Veuillez patienter une minute." },
      { status: 429 }
    );
  }
  // -----------------------------

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
      status: "paid",
      paidAt: new Date(),
    },
  });

  return NextResponse.json(order);
}
