import * as React from "react";
import { EmailTemplate } from "@/lib/emails/emailTemplate";
import { LOGO_BASE64 } from "@/lib/emails/logoBase64";

export const PartnerWelcomeEmail = ({ name }: { name: string }) => (
  <EmailTemplate title="Bienvenue !" logoBase64={LOGO_BASE64}>
    <p>Bonjour {name},</p>

    <p>Bienvenue sur Locaplux ! Votre compte est maintenant actif et vous pouvez commencer à publier vos produits.</p>

    <p>Nous sommes ravis de vous compter parmi nos partenaires.</p>
  </EmailTemplate>
);
