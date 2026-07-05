import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { minutes } = await req.json();

    if (!minutes || minutes < 0) {
      return NextResponse.json(
        { error: "Temps de réponse invalide." },
        { status: 400 }
      );
    }

    const partner = await prisma.user.findUnique({
      where: { id: params.id },
      select: { averageResponseTime: true },
    });

    if (!partner) {
      return NextResponse.json(
        { error: "Partenaire introuvable." },
        { status: 404 }
      );
    }

    const newAvg = partner.averageResponseTime
      ? Math.round((partner.averageResponseTime + minutes) / 2)
      : minutes;

    await prisma.user.update({
      where: { id: params.id },
      data: {
        averageResponseTime: newAvg,
        responseTimeUpdatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      averageResponseTime: newAvg,
    });
  } catch (error) {
    console.error("Erreur API response-time :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
