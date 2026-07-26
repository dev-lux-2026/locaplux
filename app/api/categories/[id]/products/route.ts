import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const products = await prisma.product.findMany({
      where: { categoryId: id },
      select: {
        id: true,
        name: true,
        status: true,
        images: true,
        isFree: true,
        prix_normal: true,
        prix_locaplux: true,
        prix_achat: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Erreur GET /categories/[id]/products :", error);
    return NextResponse.json(
      { error: "Erreur interne." },
      { status: 500 }
    );
  }
}
