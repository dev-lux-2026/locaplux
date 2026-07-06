import * as productEmails from "@/lib/emails/product";

export async function handleProductStatusChange(product, previousStatus) {
  const { status, partner } = product;

  switch (status) {
    case "pending":
      // Pas d’email pour pending
      break;

    case "approved":
      await productEmails.sendProductApprovedEmail(partner.email, product.id);
      break;

    case "rejected":
      await productEmails.sendProductRejectedEmail(partner.email, product.id);
      break;

    case "disabled":
      // ❌ Fonction inexistante → on supprime l’appel
      // await productEmails.sendProductDisabledEmail(partner.email, product.id);
      break;

    default:
      console.warn("Statut produit inconnu :", status);
  }
}
