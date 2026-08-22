import * as React from "react";
import { EmailTemplate } from "@/lib/emails/emailTemplate";
import { LOGO_BASE64 } from "@/lib/emails/logoBase64";

export const PartnerKycRejectedEmail = ({
  name,
  reason,
}: {
  name: string;
  reason: string;
}) => (
  <EmailTemplate title="Validation refusée" logoBase64={LOGO_BASE64}>
    <p>Bonjour {name},</p>

    <p>Après vérification, nous ne pouvons malheureusement pas valider votre compte partenaire.</p>

    <p>
      <strong>Raison :</strong> {reason}
    </p>

    <p>Vous pouvez corriger vos informations et soumettre une nouvelle demande.</p>
  </EmailTemplate>
);
