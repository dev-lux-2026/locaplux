import * as orderEmails from "@/lib/emails/order";

export async function handleOrderStatusChange(order, previousStatus) {
  const { status, user, partner } = order;

  switch (status) {
    case "pending":
      // Rien à envoyer
      break;

    case "confirmed":
      await orderEmails.sendOrderConfirmationEmail(user.email, order.id);
      break;

    case "shipped":
      await orderEmails.sendOrderShippedEmail(user.email, order.id);
      break;

    case "delivered":
      await orderEmails.sendOrderDeliveredEmail(user.email, order.id);
      break;

    case "cancelled":
      await orderEmails.sendOrderCancelledEmail(user.email, order.id);
      break;

    default:
      console.warn("Statut commande inconnu :", status);
  }
}
