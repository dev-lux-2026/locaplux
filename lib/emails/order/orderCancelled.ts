import { sendTemplatedEmail } from "../sendTemplatedEmail";
import { EmailTemplate } from "../emailTemplate";

export async function emailOrderCancelled(to: string, orderId: string) {
  return sendTemplatedEmail({
    to,
    subject: `Votre commande #${orderId} a été annulée`,
    title: "Commande annulée",
    content: (
      <div>
        <p>Bonjour,</p>

        <p>
          Votre commande <strong>#{orderId}</strong> a été annulée.
        </p>

        <p>
          Si un paiement avait été effectué, il sera automatiquement remboursé.
        </p>

        <p>
          Nous restons à votre disposition en cas de question.<br />
          L’équipe Locaplux
        </p>
      </div>
    ),
  });
}
