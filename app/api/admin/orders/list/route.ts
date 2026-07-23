import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET — Liste des commandes
export async function GET(req: Request) {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(orders);
}
