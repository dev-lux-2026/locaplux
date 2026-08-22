import * as React from "react";
import { EmailTemplate } from "@/lib/emails/emailTemplate";
import { LOGO_BASE64 } from "@/lib/emails/logoBase64";

export const PartnerPasswordResetEmail = ({
  resetLink,
}: {
  resetLink: string;
}) => (
  <EmailTemplate title="Réinitialisation du mot de passe" logoBase64={LOGO_BASE64}>
    <p>Vous avez demandé une réinitialisation de mot de passe.</p>

    <p>
      Cliquez sur le lien suivant pour définir un nouveau mot de passe :
      <br />
      <a href={resetLink}>{resetLink}</a>
    </p>
  </EmailTemplate>
);
