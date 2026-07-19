import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const id = Number(params.id);

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
