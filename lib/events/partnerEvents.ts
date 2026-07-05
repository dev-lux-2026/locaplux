import { partnerEmails } from "@/lib/emails";

export async function handlePartnerStatusChange(partner, previousStatus) {
  const { status, email } = partner;

  switch (status) {
    case "pending":
      // Pas d’email pour pending
      break;

    case "approved":
      await partnerEmails.partnerApproved(email);
      break;

    case "active":
      await partnerEmails.partnerActivated(email);
      break;

    case "paused":
      await partnerEmails.partnerPaused(email);
      break;

    case "banned":
      await partnerEmails.partnerBanned(email);
      break;

    case "rejected":
      await partnerEmails.partnerRejected(email);
      break;

    default:
      console.warn("Statut partenaire inconnu :", status);
  }
}
