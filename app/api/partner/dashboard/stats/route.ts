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

  const stats = await prisma.order.groupBy({
    by: ["createdAt"],
    where: { partnerId, status: "confirmed" },
    _sum: {
      total: true,
      commissionAmount: true,
      partnerAmount: true,
    },
  });

  const formatted = stats.map((s) => ({
    month: s.createdAt.toISOString().slice(0, 7),
    total: s._sum.total ?? 0,
    commission: s._sum.commissionAmount ?? 0,
    partner: s._sum.partnerAmount ?? 0,
  }));

  return NextResponse.json(formatted);
}
