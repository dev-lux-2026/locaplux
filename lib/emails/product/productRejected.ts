import { sendEmail } from "../../sendEmail";

export async function emailProductRejected(to: string, productName: string, reason?: string) {
  await sendEmail({
    to,
    subject: "Votre produit nécessite une modification",
    html: `
      <p>Bonjour,</p>

      <p>Votre produit <strong>${productName}</strong> n’a pas pu être validé.</p>

      ${
        reason
          ? `<p>Raison : ${reason}</p>`
          : `<p>Une ou plusieurs informations doivent être ajustées avant publication.</p>`
      }

      <p>Vous pouvez le modifier puis le soumettre à nouveau pour validation.</p>

      <p>Merci pour votre compréhension.<br>L’équipe Locaplux</p>
    `,
  });
}

