// /lib/emails/partner/partnerRegistration.ts
import * as React from "react";

export const PartnerRegistrationEmail = ({
  name,
}: {
  name: string;
}) => (
  <div>
    <p>Bonjour {name},</p>
    <p>
      Nous avons bien reçu votre demande d’inscription en tant que partenaire
      Locaplux.
    </p>
    <p>
      Notre équipe va maintenant vérifier vos informations et vous serez
      informé dès que votre compte sera validé.
    </p>
    <p>Merci de votre confiance.</p>
  </div>
);
