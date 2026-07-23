import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET — Récupérer une commande par ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id; // UUID string

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
