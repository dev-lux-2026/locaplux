import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "partner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const partnerId = session.user.id;

  const invoices = await prisma.invoice.findMany({
    where: { partnerId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invoices);
}
