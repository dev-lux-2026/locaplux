import { sendTemplatedEmail } from "../sendTemplatedEmail";

export async function sendVatCheckFailedAlert({
  company,
  publicName,
  vat,
  email,
}: {
  company?: string;
  publicName?: string;
  vat?: string;
  email: string;
}) {
  const subject = "⚠️ Vérification TVA impossible — Action requise";

  const title = "Vérification TVA impossible";

  const content = (
    <div>
      <p>Bonjour,</p>

      <p>
        Le système Locaplux n'a pas pu vérifier le numéro de TVA d’un nouveau
        partenaire. Une vérification manuelle est nécessaire.
      </p>

      <h3>Détails du partenaire :</h3>

      <ul>
        <li><strong>Entreprise :</strong> {company}</li>
        <li><strong>Nom public :</strong> {publicName}</li>
        <li><strong>Email :</strong> {email}</li>
        <li><strong>Numéro TVA :</strong> {vat}</li>
      </ul>

      <p>
        Merci de procéder à une vérification manuelle et de contacter le
        partenaire si nécessaire.
      </p>

      <p style={{ marginTop: "20px" }}>— Système Locaplux</p>
    </div>
  );

  return sendTemplatedEmail({
    to: process.env.ADMIN_EMAIL || "support@locaplux.com",
    subject,
    title,
    content,
  });
}
