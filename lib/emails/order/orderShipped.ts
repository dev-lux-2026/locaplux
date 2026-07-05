import { sendEmail } from "../../sendEmail";

export async function emailOrderShipped(to: string, orderId: string) {
  await sendEmail({
    to,
    subject: `Votre commande #${orderId} a été expédiée`,
    html: `
      <p>Bonjour,</p>

      <p>Bonne nouvelle : votre commande <strong>#${orderId}</strong> a été expédiée.</p>

      <p>Vous recevrez une notification dès qu’elle sera livrée.</p>

      <p>Merci pour votre confiance.<br>L’équipe Locaplux</p>
    `,
  });
}

