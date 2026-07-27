import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  const role = session?.user?.role ?? "";
  if (!session || role !== "partner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const partnerId = session.user!.id;

  const orders = await prisma.order.findMany({
    where: { partnerId },
    orderBy: { createdAt: "desc" },
    include: {
      user: true, // ← l’acheteur
      items: {
        include: {
          product: true, // ← produit via OrderItem
        },
      },
    },
  });

  return NextResponse.json(orders);
}
