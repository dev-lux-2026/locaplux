export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await prisma.adminLog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        admin: { select: { publicName: true, email: true } },
        partner: { select: { publicName: true, email: true } },
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("GET /api/admin/logs error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}