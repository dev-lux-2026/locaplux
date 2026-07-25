import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const boosts = await prisma.boost.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      productId: true,
      createdAt: true,
      expiresAt: true,
      type: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          images: true,
          partnerId: true,
        },
      },
    },
  });

  return NextResponse.json(boosts);
}
