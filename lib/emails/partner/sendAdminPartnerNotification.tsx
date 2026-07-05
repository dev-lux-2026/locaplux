import { sendTemplatedEmail } from "../sendTemplatedEmail";

export async function sendAdminPartnerNotification(partner: any) {
  const subject = `🆕 Nouveau partenaire inscrit : ${partner.company || partner.publicName || partner.email}`;

  const content = (
    <div>
      <h2>Nouveau partenaire Locaplux</h2>
      <p><strong>Nom :</strong> {partner.publicName || partner.company}</p>
      <p><strong>Email :</strong> {partner.email}</p>
      <p><strong>TVA :</strong> {partner.vat}</p>
      <p><strong>Ville :</strong> {partner.city}</p>
      <p><strong>Pays :</strong> {partner.country}</p>
    </div>
  );

  return sendTemplatedEmail({
    to: process.env.ADMIN_EMAIL || "admin@locaplux.com",
    subject,
    title: "Nouveau partenaire inscrit",
    content,
  });
}
