import { sendTemplatedEmail } from "../sendTemplatedEmail";

export async function emailProductRejected(to: string, productName: string, reason: string) {
  await sendTemplatedEmail({
    to,
    subject: "Votre produit a été refusé",
    title: "Produit refusé",
    content: `
      <p>Bonjour,</p>

      <p>Votre produit <strong>${productName}</strong> a été refusé.</p>

      <p>Raison :</p>
      <p>${reason}</p>

      <p>Bien à vous,<br>L’équipe Locaplux</p>
    `,
  });
}
