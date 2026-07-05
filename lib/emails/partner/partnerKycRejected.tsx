// /lib/emails/partner/partnerKycRejected.ts
import * as React from "react";

export const PartnerKycRejectedEmail = ({
  name,
  reason,
}: {
  name: string;
  reason: string;
}) => (
  <div>
    <p>Bonjour {name},</p>
    <p>
      Après vérification, nous ne pouvons malheureusement pas valider votre
      compte partenaire.
    </p>
    <p>Raison : {reason}</p>
    <p>
      Vous pouvez corriger vos informations et soumettre une nouvelle demande.
    </p>
  </div>
);
