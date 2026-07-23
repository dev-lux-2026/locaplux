import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/logAdminAction";

// ✔️ Nouveau système email premium
import {
  sendPartnerKycApprovedEmail,
  sendPartnerKycRejectedEmail,
} from "@/lib/emails/partner/sendPartnerEmails";

// ✔️ Next.js 15 : params doit être awaited
export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const application = await prisma.partnerApplication.findUnique({
    where: { userId: id },
  });

  if (!application) {
    return NextResponse.json(
      { error: "Aucune demande KYC trouvée" },
      { status: 404 }
    );
  }

  return NextResponse.json(application);
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { status, adminComment } = await req.json();

  if (!["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  // Récupérer le partenaire
  const partner = await prisma.user.findUnique({
    where: { id },
  });

  if (!partner) {
    return NextResponse.json(
      { error: "Partenaire introuvable" },
      { status: 404 }
    );
  }

  // Mise à jour de la demande KYC
  const application = await prisma.partnerApplication.update({
    where: { userId: id },
    data: {
      status,
      adminComment,
    },
  });

  // Mise à jour du statut partenaire
  await prisma.user.update({
    where: { id },
    data: {
      status: status === "approved" ? "approved" : "rejected",
    },
  });

  // Log admin
  await logAdminAction({
    partnerId: id,
    action: `kyc:${status}`,
    comment: adminComment || null,
  });

  // ✔️ Email automatique via système premium
  const displayName = partner.publicName || partner.company || partner.email || "";

  if (status === "approved") {
    const createPasswordUrl = `${process.env.NEXT_PUBLIC_URL}/create-password?user=${id}`;

    await sendPartnerKycApprovedEmail(
      partner.email ?? "",
      displayName,
      createPasswordUrl
    );
  }

  if (status === "rejected") {
    await sendPartnerKycRejectedEmail(
      partner.email ?? "",
      displayName,
      adminComment || "Votre dossier n’a pas été validé."
    );
  }

  return NextResponse.json(application);
}
