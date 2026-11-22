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

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        publicName: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        city: true,
        country: true,
        company: true,
        preferredLanguage: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        _count: {
          select: {
            ordersAsBuyer: true,
            products: true,
            buyerQuestions: true,
          },
        },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}