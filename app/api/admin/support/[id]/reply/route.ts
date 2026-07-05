import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { content, adminId } = await req.json();

  await prisma.supportMessage.create({
    data: {
      ticketId: params.id,
      from: "admin",
      content
    }
  });

  await prisma.supportTicket.update({
    where: { id: params.id },
    data: { updatedAt: new Date() }
  });

  return NextResponse.json({ success: true });
}
