import * as React from "react";
import { EmailTemplate } from "../emailTemplate";

export const PartnerWelcomeEmail = ({ name }: { name: string }) => (
  <EmailTemplate title="Bienvenue !">
    <p>Bonjour {name},</p>

    <p>
      Bienvenue sur Locaplux ! Votre compte est maintenant actif et vous pouvez
      commencer à publier vos produits.
    </p>

    <p>Nous sommes ravis de vous compter parmi nos partenaires.</p>
  </EmailTemplate>
);
