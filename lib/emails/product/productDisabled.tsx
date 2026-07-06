import { sendTemplatedEmail } from "../sendTemplatedEmail";

export async function emailProductDisabled(to: string, productName: string) {
  await sendTemplatedEmail({
    to,
    subject: "Votre produit a été désactivé",
    title: "Produit désactivé",
    content: (
      <>
        <p>Bonjour,</p>

        <p>
          Votre produit <strong>{productName}</strong> a été désactivé par l’équipe Locaplux.
        </p>

        <p>
          Bien à vous,<br />
          L’équipe Locaplux
        </p>
      </>
    ),
  });
}
