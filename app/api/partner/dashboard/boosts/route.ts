import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  const role = session?.user?.role ?? "";
  if (!session || role !== "partner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const partnerId = session.user!.id;

  const boosts = await prisma.boost.findMany({
    where: {
      partnerId,
      expiresAt: { gte: new Date() }, // ← CHAMP EXACT DU MODÈLE
    },
    include: {
      product: true,
    },
  });

  return NextResponse.json(boosts);
}
