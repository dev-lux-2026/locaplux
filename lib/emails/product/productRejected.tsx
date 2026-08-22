import { sendTemplatedEmail } from "../sendTemplatedEmail";
import { EmailTemplate } from "../emailTemplate";

export async function emailProductRejected(
  to: string,
  productName: string,
  reason: string
) {
  return sendTemplatedEmail({
    to,
    subject: "Votre produit a été refusé",
    title: "Produit refusé",
    content: (
      <EmailTemplate title="Produit refusé">
        <p>Bonjour,</p>

        <p>
          Votre produit <strong>{productName}</strong> a été refusé.
        </p>

        <p>
          <strong>Raison :</strong> {reason}
        </p>

        <p>
          Bien à vous,<br />
          L’équipe Locaplux
        </p>
      </EmailTemplate>
    ),
  });
}
