import * as React from "react";
import { EmailTemplate } from "../emailTemplate";

export const PartnerRegistrationEmail = ({ name }: { name: string }) => (
  <EmailTemplate title="Inscription reçue">
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
  </EmailTemplate>
);
