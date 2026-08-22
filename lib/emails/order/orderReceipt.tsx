import { sendTemplatedEmail } from "../sendTemplatedEmail";
import { EmailTemplate } from "../emailTemplate";

export async function emailOrderReceipt(
  to: string,
  orderId: string,
  total: number
) {
  return sendTemplatedEmail({
    to,
    subject: `Reçu de paiement — Commande #${orderId}`,
    title: "Paiement confirmé",
    content: (
      <div>
        <p>
          Votre paiement pour la commande <strong>#{orderId}</strong> a bien été
          reçu.
        </p>

        <p>
          <strong>Montant payé :</strong> {total} €
        </p>

        <p>
          Votre commande est maintenant en cours de préparation par le
          partenaire.
        </p>
      </div>
    ),
  });
}
