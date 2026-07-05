// /lib/emails/partner/partnerKycApproved.tsx
import * as React from "react";
import { EmailTemplate } from "@/lib/emails/emailTemplate";
import { LOGO_BASE64 } from "@/lib/emails/logoBase64";

interface PartnerKycApprovedEmailProps {
  name: string;
  createPasswordUrl: string;
  completeProfileUrl?: string;
}

export const PartnerKycApprovedEmail = ({
  name,
  createPasswordUrl,
  completeProfileUrl,
}: PartnerKycApprovedEmailProps) => {
  return (
    <EmailTemplate logoBase64={LOGO_BASE64}>
      <p>Bonjour {name},</p>

      <p>
        Félicitations ! Votre compte partenaire Locaplux vient d’être validé.
      </p>

      <p>
        Vous pouvez maintenant activer votre compte et accéder à votre espace
        partenaire.
      </p>

      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <a
          href={createPasswordUrl}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            padding: "14px 26px",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: "bold",
          }}
        >
          Créer mon mot de passe
        </a>
      </div>

      {completeProfileUrl && (
        <>
          <p>
            Il manque encore quelques informations facultatives à votre profil.
            Vous pouvez les compléter ici :
          </p>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <a
              href={completeProfileUrl}
              style={{
                backgroundColor: "#e5e5e5",
                color: "#000",
                padding: "12px 22px",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Compléter mon profil
            </a>
          </div>
        </>
      )}

      <p style={{ color: "#999", fontSize: "13px", marginTop: "40px" }}>
        Si vous n’êtes pas à l’origine de cette demande, ignorez simplement cet
        email.
      </p>
    </EmailTemplate>
  );
};
