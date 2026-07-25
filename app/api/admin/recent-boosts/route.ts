import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const boosts = await prisma.boost.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      price: true,
      duration: true,
      createdAt: true,
      updatedAt: true,
      expiresAt: true, // ✔ maintenant valide
      partnerId: true,
      productId: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          images: true,
          partnerId: true,
        },
      },
      partner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json(boosts);
}
