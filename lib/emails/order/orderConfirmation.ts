import { sendTemplatedEmail } from "../sendTemplatedEmail";
import { EmailTemplate } from "../emailTemplate";

export async function emailOrderConfirmation(
  to: string,
  orderId: string,
  items: any[] = [],
  total: number = 0
) {
  return sendTemplatedEmail({
    to,
    subject: `Confirmation de votre commande #${orderId}`,
    title: "Commande confirmée",
    content: (
      <div>
        <p>
          Votre commande <strong>#{orderId}</strong> a bien été confirmée.
        </p>

        <h3>Détails de la commande :</h3>

        <ul>
          {items.map((i, idx) => (
            <li key={idx}>
              {i.product.name} × {i.quantity} — {i.price * i.quantity} €
            </li>
          ))}
        </ul>

        <p>
          <strong>Total :</strong> {total} €
        </p>

        <p>
          Vous recevrez un email dès que votre commande sera prise en charge par
          le partenaire.
        </p>
      </div>
    ),
  });
}
