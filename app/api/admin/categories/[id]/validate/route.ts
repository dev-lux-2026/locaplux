import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const updated = await prisma.category.update({
    where: { id },
    data: {
      validated: true,
    },
  });

  return NextResponse.json(updated);
}
