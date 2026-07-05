import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✔️ Next.js 15 : params doit être awaited
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const logs = await prisma.adminLog.findMany({
    where: { partnerId: id }, // ✔️ Filtrage correct
    orderBy: { createdAt: "desc" },
    include: {
      admin: { select: { publicName: true, email: true } },
      partner: { select: { publicName: true, email: true } },
    },
  });

  const formatted = logs.map((log) => ({
    id: log.id,
    action: log.action,
    description: log.comment || null,
    type: "partner",
    createdAt: log.createdAt,
    user: log.admin?.publicName || log.admin?.email || "Administrateur",
  }));

  return NextResponse.json(formatted);
}
