import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      buyer: true,
      partner: true,
      products: true,
    },
  });

  return NextResponse.json(orders);
}
