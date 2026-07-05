import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const ticket = await prisma.supportTicket.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { publicName: true, email: true, role: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        select: { id: true, from: true, content: true, createdAt: true }
      }
    }
  });

  return NextResponse.json(ticket);
}
