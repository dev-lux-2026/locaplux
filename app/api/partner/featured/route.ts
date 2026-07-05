import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const partners = await prisma.user.findMany({
      where: {
        role: "partner",          // partenaire PRO
        status: "approved",       // validé par Locaplux
        publicName: { not: null },
        avatar: { not: null },    // logo obligatoire
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

    return NextResponse.json(partners);
  } catch (error) {
    console.error("Erreur featured partners:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des partenaires mis en avant." },
      { status: 500 }
    );
  }
}
