import { sendEmail } from "../../sendEmail";

export async function emailOrderReceipt(
  to: string,
  orderId: string,
  total: number
) {
  const html = `
  <!DOCTYPE html>
  <html lang="fr" style="margin:0;padding:0;">
    <body style="margin:0;padding:0;background:#f7f7f8;font-family:Arial,Helvetica,sans-serif;">
      
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f8;padding:40px 0;">
        <tr>
          <td align="center">
            
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;padding:40px;border:1px solid #e5e7eb;">
              
              <!-- Logo -->
              <tr>
                <td align="center" style="padding-bottom:20px;">
                  <img src="https://locaplux.com/logo.png" alt="Locaplux" width="140" style="display:block;">
                </td>
              </tr>

              <!-- Title -->
              <tr>
                <td style="font-size:24px;font-weight:600;color:#111827;text-align:center;padding-bottom:10px;">
                  Paiement confirmé
                </td>
              </tr>

              <!-- Subtitle -->
              <tr>
                <td style="font-size:16px;color:#4b5563;text-align:center;padding-bottom:30px;">
                  Votre paiement pour la commande <strong>#${orderId}</strong> a bien été reçu.
                </td>
              </tr>

              <!-- Summary -->
              <tr>
                <td style="padding:20px;background:#f9fafb;border-radius:12px;border:1px solid #e5e7eb;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:16px;color:#374151;">
                        Montant payé :
                      </td>
                      <td align="right" style="font-size:18px;font-weight:600;color:#111827;">
                        ${total} €
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Info -->
              <tr>
                <td style="padding-top:30px;font-size:15px;color:#4b5563;line-height:1.6;">
                  Votre commande est maintenant en cours de préparation par le partenaire.  
                  Vous recevrez une notification dès qu’elle sera expédiée.
                </td>
              </tr>

              <!-- CTA -->
              <tr>
                <td align="center" style="padding-top:30px;">
                  <a href="https://locaplux.com/order/${orderId}"
                    style="background:#111827;color:#ffffff;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:600;display:inline-block;">
                    Voir ma commande
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding-top:40px;font-size:13px;color:#9ca3af;text-align:center;line-height:1.5;">
                  Locaplux — Marketplace premium pour modèles d’exposition et fins de série.<br>
                  Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>

    </body>
  </html>
  `;

  await sendEmail({
    to,
    subject: `Reçu de paiement — Commande #${orderId}`,
    html,
  });
}

