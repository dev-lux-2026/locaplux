import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tickets = await prisma.supportTicket.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      type: true,
      subject: true,
      priority: true,
      status: true,
      updatedAt: true,
      author: {
        select: { publicName: true, email: true, role: true }
      }
    }
  });

  return NextResponse.json({ tickets });
}
