import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/app/api/admin/log";

export async function PATCH(req, context) {
  const id = params.id;
  const { status, adminId, comment } = await req.json();

  const validStatuses = ["pending", "approved", "rejected", "disabled"];

  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const updated = await prisma.product.update({
    where: { id },
    data: { status },
  });

  await logAdminAction({
    adminId: adminId || "system",
    partnerId: updated.partnerId,
    action: `product:${status}`,
    comment: comment || null,
  });

  return NextResponse.json(updated);
}
