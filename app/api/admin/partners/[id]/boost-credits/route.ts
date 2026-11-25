export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const credits = Number(body.freeBoostCredits);

    if (!Number.isInteger(credits) || credits < 0) {
      return NextResponse.json(
        { error: "Nombre de crédits invalide" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: { freeBoostCredits: credits },
      select: { id: true, freeBoostCredits: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/admin/partners/[id]/boost-credits error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}