import { sendEmail } from "../../sendEmail";

export async function emailOrderCancelled(to: string, orderId: string) {
  await sendEmail({
    to,
    subject: `Votre commande #${orderId} a été annulée`,
    html: `
      <p>Bonjour,</p>

      <p>Votre commande <strong>#${orderId}</strong> a été annulée.</p>

      <p>Si un paiement avait été effectué, il sera automatiquement remboursé.</p>

      <p>Nous restons à votre disposition en cas de question.<br>L’équipe Locaplux</p>
    `,
  });
}

