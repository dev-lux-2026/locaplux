import * as partnerEmails from "@/lib/emails/partner";

export async function handlePartnerStatusChange(partner, previousStatus) {
  const { status, email } = partner;

  switch (status) {
    case "pending":
      // Pas d’email pour pending
      break;

    case "approved":
      await partnerEmails.sendPartnerApprovedEmail(email);
      break;

    case "active":
      await partnerEmails.sendPartnerActivatedEmail(email);
      break;

    case "paused":
      await partnerEmails.sendPartnerPausedEmail(email);
      break;

    case "banned":
      await partnerEmails.sendPartnerBannedEmail(email);
      break;

    case "rejected":
      await partnerEmails.sendPartnerRejectedEmail(email);
      break;

    default:
      console.warn("Statut partenaire inconnu :", status);
  }
}
