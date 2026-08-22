import { sendTemplatedEmail } from "../sendTemplatedEmail";
import { EmailTemplate } from "../emailTemplate";

export async function emailOrderNew(
  to: string,
  orderId: string,
  items: any[] = [],
  total: number = 0
) {
  return sendTemplatedEmail({
    to,
    subject: `Nouvelle commande #${orderId}`,
    title: "Nouvelle commande reçue",
    content: (
      <div>
        <p>
          Une nouvelle commande <strong>#{orderId}</strong> vient d’être passée
          sur votre boutique Locaplux.
        </p>

        <h3>Détails :</h3>

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
          Connectez-vous à votre espace partenaire pour préparer la commande.
        </p>
      </div>
    ),
  });
}
