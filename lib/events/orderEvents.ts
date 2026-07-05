import { orderEmails } from "@/lib/emails";

export async function handleOrderStatusChange(order, previousStatus) {
  const { status, user, partner } = order;

  switch (status) {
    case "pending":
      // Rien à envoyer
      break;

    case "confirmed":
      await orderEmails.orderConfirmation(user.email, order.id);
      break;

    case "shipped":
      await orderEmails.orderShipped(user.email, order.id);
      break;

    case "delivered":
      await orderEmails.orderDelivered(user.email, order.id);
      break;

    case "cancelled":
      await orderEmails.orderCancelled(user.email, order.id);
      break;

    default:
      console.warn("Statut commande inconnu :", status);
  }
}
