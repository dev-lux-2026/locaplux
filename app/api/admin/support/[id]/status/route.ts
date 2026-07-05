import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { status } = await req.json();

  await prisma.supportTicket.update({
    where: { id: params.id },
    data: { status }
  });

  return NextResponse.json({ success: true });
}
