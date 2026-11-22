export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/app/api/admin/log";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { status, comment } = await req.json();

    if (!status) {
      return NextResponse.json(
        { error: "Le statut est requis." },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        status: true,
        partnerId: true,
        name: true,
      },
    });

    const baseComment =
      comment ??
      `Statut du produit "${updatedProduct.name}" (${updatedProduct.id}) mis à jour : ${status}`;
    const finalComment = baseComment.includes(updatedProduct.id)
      ? baseComment
      : `${baseComment} [Produit #${updatedProduct.id}]`;

    await logAdminAction({
      adminId: "", // ✔ requis par le type, remplacé automatiquement par NextAuth
      partnerId: updatedProduct.partnerId,
      action: "product_status_update",
      comment: finalComment,
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("PATCH /api/admin/products/[id]/status error:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la mise à jour du statut." },
      { status: 500 }
    );
  }
}