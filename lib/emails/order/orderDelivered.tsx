import { sendTemplatedEmail } from "../sendTemplatedEmail";
import { EmailTemplate } from "../emailTemplate";

export async function emailOrderDelivered(to: string, orderId: string) {
  return sendTemplatedEmail({
    to,
    subject: `Votre commande #${orderId} a été livrée`,
    title: "Commande livrée",
    content: (
      <div>
        <p>Bonjour,</p>

        <p>
          Votre commande <strong>#{orderId}</strong> a été livrée avec succès.
        </p>

        <p>Nous espérons que tout est conforme à vos attentes.</p>

        <p>
          N’hésitez pas à laisser un avis pour aider les autres acheteurs.
        </p>

        <p>
          Merci pour votre confiance.<br />
          L’équipe Locaplux
        </p>
      </div>
    ),
  });
}
