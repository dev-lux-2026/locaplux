import { sendTemplatedEmail } from "../sendTemplatedEmail";

export async function emailProductApproved(to: string, productName: string) {
  await sendTemplatedEmail({
    to,
    subject: "Votre produit est maintenant en ligne",
    title: "Produit approuvé",
    content: (
      <>
        <p>Bonjour,</p>

        <p>
          Votre produit <strong>{productName}</strong> a été validé et est désormais
          visible sur Locaplux.
        </p>

        <p>
          Merci pour votre confiance et votre contribution à la qualité de la
          plateforme.
        </p>

        <p>
          Bien à vous,<br />
          L’équipe Locaplux
        </p>
      </>
    ),
  });
}
