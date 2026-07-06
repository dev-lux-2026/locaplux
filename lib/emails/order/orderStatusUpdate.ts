import { sendOrderStatusUpdateEmail } from "./sendOrderEmails";

export async function emailOrderStatusUpdate(
  to: string,
  orderId: string,
  status: string
) {
  const labels = {
    shipped: "Votre commande a été expédiée",
    delivered: "Votre commande a été livrée",
    cancelled: "Votre commande a été annulée",
  };

  const messages = {
    shipped: "Votre colis est en route. Vous pourrez suivre sa progression depuis votre espace Locaplux.",
    delivered: "Votre commande a été livrée. Nous espérons qu’elle vous apportera entière satisfaction.",
    cancelled: "Votre commande a été annulée. Si vous pensez qu’il s’agit d’une erreur, contactez notre support.",
  };

  const html = `
  <!DOCTYPE html>
  <html lang="fr">
    <body style="margin:0;padding:0;background:#f7f7f8;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;padding:40px;border:1px solid #e5e7eb;">
              
              <tr>
                <td align="center" style="padding-bottom:20px;">
                  <img src="https://locaplux.com/logo.png" width="140">
                </td>
              </tr>

              <tr>
                <td style="font-size:24px;font-weight:600;color:#111827;text-align:center;padding-bottom:10px;">
                  ${labels[status]}
                </td>
              </tr>

              <tr>
                <td style="font-size:16px;color:#4b5563;text-align:center;padding-bottom:30px;">
                  Commande <strong>#${orderId}</strong>
                </td>
              </tr>

              <tr>
                <td style="font-size:15px;color:#4b5563;line-height:1.6;">
                  ${messages[status]}
                </td>
              </tr>

              <tr>
                <td align="center" style="padding-top:30px;">
                  <a href="https://locaplux.com/order/${orderId}"
                    style="background:#111827;color:#ffffff;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:600;">
                    Voir ma commande
                  </a>
                </td>
              </tr>

              <tr>
                <td style="padding-top:40px;font-size:13px;color:#9ca3af;text-align:center;">
                  Locaplux — Marketplace premium pour modèles d’exposition et fins de série.
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
    subject: labels[status],
    html,
  });
}

