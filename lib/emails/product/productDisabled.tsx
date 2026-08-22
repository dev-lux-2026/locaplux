import { sendTemplatedEmail } from "../sendTemplatedEmail";
import { EmailTemplate } from "../emailTemplate";

export async function emailProductDisabled(to: string, productName: string) {
  return sendTemplatedEmail({
    to,
    subject: "Votre produit a été désactivé",
    title: "Produit désactivé",
    content: (
      <EmailTemplate title="Produit désactivé">
        <p>Bonjour,</p>

        <p>
          Votre produit <strong>{productName}</strong> a été désactivé par l’équipe Locaplux.
        </p>

        <p>
          Bien à vous,<br />
          L’équipe Locaplux
        </p>
      </EmailTemplate>
    ),
  });
}
