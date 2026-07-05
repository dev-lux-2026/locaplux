import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  const { id } = params;

  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      deliveryStatus: true,
      deliveryMode: true,
      deliveryDistance: true,
      deliveryPrice: true,
      deliveryConfirmed: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
