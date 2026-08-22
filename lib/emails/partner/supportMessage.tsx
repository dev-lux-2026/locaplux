import * as React from "react";
import { EmailTemplate } from "../emailTemplate";

export const PartnerSupportMessageEmail = ({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) => (
  <EmailTemplate title="Message de support">
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
