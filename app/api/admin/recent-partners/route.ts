import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const partners = await prisma.user.findMany({
    where: { role: "partner" },
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: { select: { products: true } },
    },
  });

  return NextResponse.json(partners);
}
