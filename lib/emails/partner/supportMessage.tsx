// /lib/emails/partner/supportMessage.ts
import * as React from "react";

export const PartnerSupportMessageEmail = ({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) => (
  <div>
    <p>Nouveau message de support :</p>
    <p><strong>Nom :</strong> {name}</p>
    <p><strong>Email :</strong> {email}</p>
    <p><strong>Message :</strong></p>
    <p>{message}</p>
  </div>
);
