import * as React from "react";
import { EmailTemplate } from "../emailTemplate";

export const PartnerKycRejectedEmail = ({
  name,
  reason,
}: {
  name: string;
  reason: string;
}) => (
  <EmailTemplate title="Validation refusée">
    <p>Bonjour {name},</p>

    <p>
      Après vérification, nous ne pouvons malheureusement pas valider votre
      compte partenaire.
    </p>

    <p>
      <strong>Raison :</strong> {reason}
    </p>

    <p>
      Vous pouvez corriger vos informations et soumettre une nouvelle demande.
    </p>
  </EmailTemplate>
);
