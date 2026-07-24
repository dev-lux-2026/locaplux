import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      stock: true,
      active: true,
      status: true,
      images: true,
      createdAt: true,
      updatedAt: true,

      prix_normal: true,
      prix_locaplux: true,
      prix_achat: true,

      partner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return NextResponse.json(products);
}
