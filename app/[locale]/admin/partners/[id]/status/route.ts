import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/logAdminAction";

import {
  sendPartnerKycApprovedEmail,
  sendPartnerKycRejectedEmail,
} from "@/lib/emails/partner/sendPartnerEmails";

import { createPartnerActivationToken } from "@/lib/auth/createPartnerActivationToken";

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const { status, comment } = await req.json();

  const validStatuses = [
    "pending",
    "approved",
    "active",
    "paused",
    "banned",
    "rejected",
  ];

  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const partner = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      publicName: true,
      company: true,
      firstName: true,
      lastName: true,
    },
  });

  if (!partner) {
    return NextResponse.json(
      { error: "Partenaire introuvable" },
      { status: 404 }
    );
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { status },
  });

  // Log admin
  await logAdminAction({
    partnerId: id,
    action: `status:${status}`,
    comment: comment ?? null,
  });

  // Toujours un string
  const displayName =
    partner.publicName ??
    partner.company ??
    `${partner.firstName ?? ""} ${partner.lastName ?? ""}`.trim() ??
    "";

  // APPROVED → créer token + envoyer email
  if (status === "approved") {
    const token = await createPartnerActivationToken(partner.id);

    const createPasswordUrl =
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/create-password?token=${token}` ?? "";

    await sendPartnerKycApprovedEmail(
      partner.email ?? "",
      displayName || "",
      createPasswordUrl || ""
    );
  }

  // REJECTED → email rejet
  if (status === "rejected") {
    await sendPartnerKycRejectedEmail(
      partner.email ?? "",
      displayName || "",
      "Votre dossier n’a pas été accepté."
    );
  }

  return NextResponse.json(updated);
}
