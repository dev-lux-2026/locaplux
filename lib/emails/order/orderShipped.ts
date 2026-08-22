import { sendTemplatedEmail } from "../sendTemplatedEmail";
import { EmailTemplate } from "../emailTemplate";

export async function emailOrderShipped(to: string, orderId: string) {
  return sendTemplatedEmail({
    to,
    subject: `Votre commande #${orderId} a été expédiée`,
    title: "Commande expédiée",
    content: (
      <div>
        <p>Bonjour,</p>

        <p>
          Bonne nouvelle : votre commande <strong>#{orderId}</strong> a été
          expédiée.
        </p>

        <p>Vous recevrez une notification dès qu’elle sera livrée.</p>

        <p>
          Merci pour votre confiance.<br />
          L’équipe Locaplux
        </p>
      </div>
    ),
  });
}
