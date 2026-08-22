import * as React from "react";
import { EmailTemplate } from "@/lib/emails/emailTemplate";
import { LOGO_BASE64 } from "@/lib/emails/logoBase64";

export const PartnerSupportMessageEmail = ({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) => (
  <EmailTemplate title="Message de support" logoBase64={LOGO_BASE64}>
    <p>Nouveau message de support partenaire :</p>

    <p>
      <strong>Nom :</strong> {name}
    </p>

    <p>
      <strong>Email :</strong> {email}
    </p>

    <p>
      <strong>Message :</strong>
    </p>

    <p>{message}</p>
  </EmailTemplate>
);
