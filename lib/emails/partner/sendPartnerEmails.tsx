import { sendTemplatedEmail } from "../sendTemplatedEmail";

// Templates
import { PartnerRegistrationEmail } from "./partnerRegistration";
import { PartnerKycApprovedEmail } from "./partnerKycApproved";
import { PartnerKycRejectedEmail } from "./partnerKycRejected";
import { PartnerWelcomeEmail } from "./partnerWelcome";
import { PartnerPasswordResetEmail } from "./passwordReset";
import { PartnerSupportMessageEmail } from "./supportMessage";

// 1) Inscription partenaire
export async function sendPartnerRegistrationEmail(to: string, name: string) {
  return sendTemplatedEmail({
    to,
    subject: "Votre inscription partenaire Locaplux",
    title: "Inscription reçue",
    content: <PartnerRegistrationEmail name={name} />,
  });
}

// 2) KYC validé → activation du compte
export async function sendPartnerKycApprovedEmail(
  to: string,
  name: string,
  createPasswordUrl: string,
  completeProfileUrl?: string
) {
  return sendTemplatedEmail({
    to,
    subject: "Votre compte partenaire est validé",
    title: "Compte validé",
    content: (
      <PartnerKycApprovedEmail
        name={name}
        createPasswordUrl={createPasswordUrl}
        completeProfileUrl={completeProfileUrl}
      />
    ),
  });
}

// 3) KYC refusé
export async function sendPartnerKycRejectedEmail(
  to: string,
  name: string,
  reason: string
) {
  return sendTemplatedEmail({
    to,
    subject: "Votre compte partenaire n’a pas été validé",
    title: "Validation refusée",
    content: <PartnerKycRejectedEmail name={name} reason={reason} />,
  });
}

// 4) Bienvenue partenaire
export async function sendPartnerWelcomeEmail(to: string, name: string) {
  return sendTemplatedEmail({
    to,
    subject: "Bienvenue sur Locaplux",
    title: "Bienvenue !",
    content: <PartnerWelcomeEmail name={name} />,
  });
}

// 5) Réinitialisation mot de passe
export async function sendPartnerPasswordResetEmail(
  to: string,
  resetLink: string
) {
  return sendTemplatedEmail({
    to,
    subject: "Réinitialisation de votre mot de passe",
    title: "Réinitialisation",
    content: <PartnerPasswordResetEmail resetLink={resetLink} />,
  });
}

// 6) Message support → Admin
export async function sendPartnerSupportMessageEmail(
  to: string,
  name: string,
  email: string,
  message: string
) {
  return sendTemplatedEmail({
    to,
    subject: "Nouveau message de support partenaire",
    title: "Message de support",
    content: (
      <PartnerSupportMessageEmail
        name={name}
        email={email}
        message={message}
      />
    ),
  });
}
