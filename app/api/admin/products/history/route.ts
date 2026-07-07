import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const history = await prisma.productValidationHistory.findMany({
    include: {
      product: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(history);
}
