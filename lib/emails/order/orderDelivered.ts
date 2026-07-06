import { sendOrderDeliveredEmail } from "./sendOrderEmails";

export async function emailOrderDelivered(to: string, orderId: string) {
  await sendEmail({
    to,
    subject: `Votre commande #${orderId} a été livrée`,
    html: `
      <p>Bonjour,</p>

      <p>Votre commande <strong>#${orderId}</strong> a été livrée avec succès.</p>

      <p>Nous espérons que tout est conforme à vos attentes.</p>

      <p>N’hésitez pas à laisser un avis pour aider les autres acheteurs.</p>

      <p>Merci pour votre confiance.<br>L’équipe Locaplux</p>
    `,
  });
}

