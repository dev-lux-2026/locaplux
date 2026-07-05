import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { status } = body;

  const updated = await prisma.product.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json(updated);
}
