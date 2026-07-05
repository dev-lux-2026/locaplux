import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  const id = params.id;

  const logs = await prisma.adminLog.findMany({
    where: { partnerId: id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      action: true,
      comment: true,
      createdAt: true,
      admin: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return NextResponse.json(logs);
}
