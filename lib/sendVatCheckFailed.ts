import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVatCheckFailedAlert(data: {
  company: string;
  publicName: string;
  vat: string;
  email: string;
}) {
  try {
    await resend.emails.send({
      from: "Locaplux <no-reply@locaplux.com>",
      to: "locaplux@outlook.com",
      subject: "⚠️ TVA non vérifiée via VIES",
      html: `
        <h2>⚠️ Vérification TVA impossible</h2>
        <p>La vérification VIES a échoué pour une nouvelle demande partenaire.</p>

        <p><strong>Entreprise :</strong> ${data.company}</p>
        <p><strong>Nom commercial :</strong> ${data.publicName}</p>
        <p><strong>TVA :</strong> ${data.vat}</p>
        <p><strong>Email :</strong> ${data.email}</p>

        <p>Merci de vérifier manuellement le numéro de TVA.</p>
      `,
    });
  } catch (error) {
    console.error("Erreur envoi email TVA :", error);
  }
}
