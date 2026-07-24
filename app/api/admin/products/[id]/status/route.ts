import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/app/api/admin/log";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Lecture du body
  const { status, comment } = await req.json();

  // Vérification simple du statut (sécurité)
  if (!status) {
    return NextResponse.json(
      { error: "Le statut est requis." },
      { status: 400 }
    );
  }

  // Mise à jour du produit
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

  // Log admin automatique (NextAuth récupère adminId)
  await logAdminAction({
    partnerId: updatedProduct.partnerId,
    action: "product_status_update",
    comment:
      comment ??
      `Statut du produit "${updatedProduct.name}" mis à jour : ${status}`,
  });

  return NextResponse.json({
    success: true,
    product: updatedProduct,
  });
}
