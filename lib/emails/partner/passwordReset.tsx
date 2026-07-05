// /lib/emails/partner/passwordReset.ts
import * as React from "react";

export const PartnerPasswordResetEmail = ({
  resetLink,
}: {
  resetLink: string;
}) => (
  <div>
    <p>Vous avez demandé une réinitialisation de mot de passe.</p>
    <p>
      Cliquez sur le lien suivant pour définir un nouveau mot de passe :
      <br />
      <a href={resetLink}>{resetLink}</a>
    </p>
  </div>
);
