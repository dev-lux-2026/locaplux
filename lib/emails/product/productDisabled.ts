import { sendProductApprovedEmail } from "./sendProductEmails";

export async function emailProductDisabled(to: string, productName: string) {
  await sendEmail({
    to,
    subject: "Votre produit a été désactivé",
    html: `
      <p>Bonjour,</p>

      <p>Votre produit <strong>${productName}</strong> a été désactivé par notre équipe afin de garantir la qualité et la sécurité de la plateforme.</p>

      <p>Vous pouvez le modifier puis le republier si nécessaire.</p>

      <p>Bien cordialement,<br>L’équipe Locaplux</p>
    `,
  });
}

