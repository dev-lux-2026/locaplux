import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const boosts = await prisma.boost.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { title: true } },
    },
  });

  return NextResponse.json(boosts);
}
