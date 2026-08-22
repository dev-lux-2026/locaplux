import { sendTemplatedEmail } from "../sendTemplatedEmail";
import { EmailTemplate } from "../emailTemplate";

export async function emailOrderStatusUpdate(
  to: string,
  orderId: string,
  status: "shipped" | "delivered" | "cancelled"
) {
  const labels = {
    shipped: "Votre commande a été expédiée",
    delivered: "Votre commande a été livrée",
    cancelled: "Votre commande a été annulée",
  };

  const messages = {
    shipped:
      "Votre colis est en route. Vous pourrez suivre sa progression depuis votre espace Locaplux.",
    delivered:
      "Votre commande a été livrée. Nous espérons qu’elle vous apportera entière satisfaction.",
    cancelled:
      "Votre commande a été annulée. Si vous pensez qu’il s’agit d’une erreur, contactez notre support.",
  };

  return sendTemplatedEmail({
    to,
    subject: labels[status],
    title: labels[status],
    content: (
      <div>
        <p>
          Commande <strong>#{orderId}</strong>
        </p>

        <p>{messages[status]}</p>
      </div>
    ),
  });
}
