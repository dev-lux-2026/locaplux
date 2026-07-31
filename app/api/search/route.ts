import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  const query = q.trim();

  const products = await prisma.product.findMany({
    where: {
      active: true,
      status: "approved",

      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { category: { name: { contains: query, mode: "insensitive" } } },
        { condition: { contains: query, mode: "insensitive" } },
        { damage_type: { contains: query, mode: "insensitive" } },
      ],
    },

    select: {
      id: true,
      name: true,
      slug: true,
      images: true,
      prix_locaplux: true,
      prix_normal: true,
      condition: true,
      category: {
        select: {
          id: true,
          name: true, // ✔ slug supprimé
        },
      },
    },

    orderBy: [
      { images: "desc" },
      { createdAt: "desc" },
    ],

    take: 30,
  });

  return NextResponse.json(products);
}
