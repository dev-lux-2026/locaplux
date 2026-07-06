import {
  sendPartnerKycApprovedEmail,
  sendPartnerKycRejectedEmail,
} from "@/lib/emails/partner/sendPartnerEmails";
import { createPartnerActivationToken } from "@/lib/auth/createPartnerActivationToken";

export async function handlePartnerStatusChange(partner) {
  const { status, email, id, publicName, company } = partner;

  const displayName = publicName || company || email;

  switch (status) {
    case "approved": {
      const token = await createPartnerActivationToken(id);
      const url = `${process.env.NEXT_PUBLIC_APP_URL}/auth/create-password?token=${token}`;
      await sendPartnerKycApprovedEmail(email, displayName, url);
      break;
    }

    case "rejected": {
      await sendPartnerKycRejectedEmail(
        email,
        displayName,
        "Votre dossier n’a pas été accepté."
      );
      break;
    }

    // Les autres statuts n'ont pas d'email associé
    case "active":
    case "paused":
    case "banned":
    case "pending":
    default:
      break;
  }
}
