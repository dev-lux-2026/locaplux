import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  const role = session?.user?.role ?? "";
  if (!session || role !== "partner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { partnerId: session.user!.id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: true,
    },
    orderBy: { id: "desc" },
  });

  return NextResponse.json(orders);
}
