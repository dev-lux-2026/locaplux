import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  const id = Number(params.id);

  const updated = await prisma.category.update({
    where: { id },
    data: { validated: true },
  });

  return NextResponse.json(updated);
}
