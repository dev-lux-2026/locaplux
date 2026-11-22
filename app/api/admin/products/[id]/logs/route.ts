export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        partnerId: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 }
      );
    }

    const logs = await prisma.adminLog.findMany({
      where: {
        partnerId: product.partnerId,
        OR: [
          { action: "product_category_update" },
          { action: "product_status_update" },
          { action: { startsWith: "product:" } },
          { comment: { contains: id } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        adminId: true,
        action: true,
        comment: true,
        createdAt: true,
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("GET /api/admin/products/[id]/logs error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}