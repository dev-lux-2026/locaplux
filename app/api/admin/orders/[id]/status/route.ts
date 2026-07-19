import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  const id = Number(params.id);
  const { status } = await req.json();

  const valid = [
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ];

  if (!valid.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updated);
}
