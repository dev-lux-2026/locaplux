import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "partner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const partnerId = session.user.id;

  const orders = await prisma.order.findMany({
    where: { partnerId },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      items: { include: { product: true } },
    },
  });

  return NextResponse.json(orders);
}
