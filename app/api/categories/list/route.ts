import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getLocale } from "next-intl/server";

export async function GET() {
  try {
    const locale = await getLocale();

    const categories = await prisma.category.findMany({
      where: {
        products: {
          some: {},
        },
      },
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        name_fr: true,
        name_en: true,
        name_lu: true,
        products: {
          select: {
            images: true,
          },
          take: 1,
        },
      },
    });

    return NextResponse.json(
      categories.map((c) => ({
        id: c.id,
        name:
          locale === "fr"
            ? c.name_fr || c.name
            : locale === "en"
            ? c.name_en || c.name_fr || c.name
            : c.name_lu || c.name_fr || c.name,
        image: c.products[0]?.images?.[0] || null,
      }))
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
