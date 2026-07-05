import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: { id: true, email: true, name: true },
      },
      items: {
        include: {
          product: {
            select: { id: true, name: true, price: true },
          },
        },
      },
    },
    orderBy: { id: "desc" },
  });

  return NextResponse.json(orders);
}
