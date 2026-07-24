import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/app/api/admin/log";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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

  await logAdminAction({
    adminId: "", // ✔ requis par le type, remplacé automatiquement par NextAuth
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
