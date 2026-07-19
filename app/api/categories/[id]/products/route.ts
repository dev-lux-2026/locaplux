import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, context) {
  try {
    const { id } = params;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const products = await prisma.product.findMany({
      where: {
        categoryId: id,
        status: "approved",
      },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        partner: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching category products:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
