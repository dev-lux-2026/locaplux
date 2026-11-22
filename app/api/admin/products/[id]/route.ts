export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/app/api/admin/log";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      categoryId: true,
      partnerId: true,

      prix_normal: true,
      prix_locaplux: true,
      prix_achat: true,

      stock: true,
      status: true,
      images: true,
      createdAt: true,
      updatedAt: true,

      partner: {
        select: {
          id: true,
          name: true,
          firstName: true,
          lastName: true,
          publicName: true,
          company: true,
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

  if (!product) {
    return NextResponse.json(
      { error: "Produit introuvable" },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { categoryId } = body ?? {};

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { category: { select: { id: true, name: true } } },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data:
        categoryId === null || categoryId === ""
          ? { category: { disconnect: true } }
          : { category: { connect: { id: String(categoryId) } } },
      select: {
        id: true,
        name: true,
        description: true,
        categoryId: true,
        partnerId: true,
        prix_normal: true,
        prix_locaplux: true,
        prix_achat: true,
        stock: true,
        status: true,
        images: true,
        createdAt: true,
        updatedAt: true,
        partner: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            publicName: true,
            company: true,
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

    const oldCat = existing.category?.name || "Aucune";
    const newCat = updated.category?.name || "Aucune";

    if (existing.partnerId) {
      await logAdminAction({
        adminId: "",
        partnerId: existing.partnerId,
        action: "product_category_update",
        comment: `[Produit #${id}] Catégorie modifiée : ${oldCat} → ${newCat}`,
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}