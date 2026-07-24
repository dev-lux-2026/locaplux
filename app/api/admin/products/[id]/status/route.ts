import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/app/api/admin/log";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const { status, comment } = await req.json();

  // Mise à jour du produit
  const updated = await prisma.product.update({
    where: { id },
    data: { status },
  });

  // Log admin automatique (NextAuth récupère adminId)
  await logAdminAction({
    partnerId: updated.partnerId,
    action: `product_status_update`,
    comment: comment ?? `Changement du statut produit : ${status}`,
  });

  return NextResponse.json({ success: true, product: updated });
}
