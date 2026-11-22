export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const partners = await prisma.user.findMany({
      where: {
        role: "partner",
        status: { in: ["approved", "active"] },
        AND: [
          {
            OR: [
              { publicName: { not: null } },
              { company: { not: null } },
            ],
          },
          {
            NOT: [
              { publicName: "" },
              { company: "" },
            ],
          },
        ],
      },
      select: {
        id: true,
        publicName: true,
        avatar: true,
        slug: true,
        bannerUrl: true,
        city: true,
        company: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    const formatted = partners
      .map((p) => ({
        ...p,
        publicName: (p.publicName || p.company || "").trim(),
      }))
      .filter((p) => p.publicName.length > 0);

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Erreur featured partners:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des partenaires mis en avant." },
      { status: 500 }
    );
  }
}