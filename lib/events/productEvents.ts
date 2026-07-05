import { productEmails } from "@/lib/emails";

export async function handleProductStatusChange(product, previousStatus) {
  const { status, partner } = product;

  switch (status) {
    case "pending":
      // Pas d’email pour pending
      break;

    case "approved":
      await productEmails.productApproved(partner.email);
      break;

    case "rejected":
      await productEmails.productRejected(partner.email);
      break;

    case "disabled":
      await productEmails.productDisabled(partner.email);
      break;

    default:
      console.warn("Statut produit inconnu :", status);
  }
}
