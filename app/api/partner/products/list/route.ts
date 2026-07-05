import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const partnerId = req.headers.get("x-partner-id");

  if (!partnerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    where: { partnerId: Number(partnerId) },
    include: { category: true },
  });

  return NextResponse.json(products);
}
