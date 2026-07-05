import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/logAdminAction";

// ✔️ Next.js 15 : params doit être awaited
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const updated = await prisma.user.update({
    where: { id },
    data: {
      commissionRate: body.commissionRate,
      freeProductLimit: body.freeProductLimit,
      freeDaysLimit: body.freeDaysLimit,
      freeUntil: body.freeUntil,

      // Champs business
      address: body.address,
      tva: body.tva,
      website: body.website,
      description: body.description,
      deliveryRadius: body.deliveryRadius,
    },
  });

  await logAdminAction({
    adminId: body.adminId || "system",
    partnerId: id,
    action: "update",
    comment: "Mise à jour des informations partenaire",
  });

  return NextResponse.json(updated);
}
