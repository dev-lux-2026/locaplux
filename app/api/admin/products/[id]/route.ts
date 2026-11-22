export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      categoryId: true,

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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
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

    // Enregistrement dans l'historique admin (si le modèle existe dans Prisma)
    const adminId = session.user?.id || "admin";
    const oldCat = existing.category?.name || "Aucune";
    const newCat = updated.category?.name || "Aucune";
    const comment = `Catégorie modifiée : ${oldCat} → ${newCat}`;

    try {
      const pAny = prisma as any;
      if (pAny.productValidationHistory?.create) {
        await pAny.productValidationHistory.create({
          data: {
            productId: id,
            adminId,
            action: "category_updated",
            comment,
          },
        });
      } else if (pAny.adminLog?.create) {
        await pAny.adminLog.create({
          data: {
            productId: id,
            adminId,
            action: "category_updated",
            comment,
          },
        });
      }
    } catch (logErr) {
      console.error("Erreur création log admin catégorie:", logErr);
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