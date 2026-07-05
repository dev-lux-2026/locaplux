import { prisma } from "@/lib/prisma";
import { handlePartnerStatusChange } from "@/lib/events";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { userId, newStatus } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const previousStatus = user.status;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
    });

    if (previousStatus !== newStatus) {
      await handlePartnerStatusChange(updatedUser, previousStatus);
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Erreur update partner status:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
