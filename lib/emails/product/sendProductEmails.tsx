import { sendTemplatedEmail } from "../sendTemplatedEmail";

// Templates
import { ProductApprovedEmail } from "./productApproved";
import { ProductRejectedEmail } from "./productRejected";
import { ProductDisabledEmail } from "./productDisabled";

// 1) Produit approuvé
export async function sendProductApprovedEmail(to: string, productId: string) {
  return sendTemplatedEmail({
    to,
    subject: "Votre produit a été approuvé",
    title: "Produit approuvé",
    content: <ProductApprovedEmail productId={productId} />,
  });
}

// 2) Produit rejeté
export async function sendProductRejectedEmail(
  to: string,
  productId: string,
  reason: string
) {
  return sendTemplatedEmail({
    to,
    subject: "Votre produit a été rejeté",
    title: "Produit rejeté",
    content: <ProductRejectedEmail productId={productId} reason={reason} />,
  });
}

// 3) Produit désactivé
export async function sendProductDisabledEmail(
  to: string,
  productId: string
) {
  return sendTemplatedEmail({
    to,
    subject: "Votre produit a été désactivé",
    title: "Produit désactivé",
    content: <ProductDisabledEmail productId={productId} />,
  });
}
