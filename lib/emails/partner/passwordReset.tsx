import * as React from "react";
import { EmailTemplate } from "../emailTemplate";

export const PartnerPasswordResetEmail = ({
  resetLink,
}: {
  resetLink: string;
}) => (
  <EmailTemplate title="Réinitialisation du mot de passe">
    <p>Vous avez demandé une réinitialisation de mot de passe.</p>

    <p>
      Cliquez sur le lien suivant pour définir un nouveau mot de passe :
      <br />
      <a href={resetLink}>{resetLink}</a>
    </p>
  </EmailTemplate>
);
