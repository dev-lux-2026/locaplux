import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  // On récupère le produit pour connaître son partenaire
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      partnerId: true,
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  // On récupère les logs admin liés aux actions produit pour ce partenaire
  const logs = await prisma.adminLog.findMany({
    where: {
      partnerId: product.partnerId,
      action: {
        startsWith: "product:",
      },
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
}
