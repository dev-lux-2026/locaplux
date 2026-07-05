// /lib/emails/partner/partnerWelcome.ts
import * as React from "react";

export const PartnerWelcomeEmail = ({
  name,
}: {
  name: string;
}) => (
  <div>
    <p>Bonjour {name},</p>
    <p>
      Bienvenue sur Locaplux ! Votre compte est maintenant actif et vous pouvez
      commencer à publier vos produits.
    </p>
    <p>Nous sommes ravis de vous compter parmi nos partenaires.</p>
  </div>
);
