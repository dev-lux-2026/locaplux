import { Resend } from "resend";
import { render } from "@react-email/render";
import { EmailTemplate } from "./emailTemplate";

// Initialisation sans crash. Si la clé est absente au build, Resend ne bloquera pas Next.js
const resend = new Resend(process.env.RESEND_API_KEY || "temp_key");

export async function sendTemplatedEmail({
  to,
  subject,
  title,
  content,
}: {
  to: string;
  subject: string;
  title: string;
  content: React.ReactNode;
}) {
  // 🔒 Sécurisation en runtime (uniquement quand on essaie d'envoyer un mail)
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ Envoi annulé : RESEND_API_KEY manquante dans les variables d'environnement");
    return { success: false, error: "Missing RESEND_API_KEY" };
  }

  try {
    const html = await render(
      <EmailTemplate title={title}>{content}</EmailTemplate>
    );

    await resend.emails.send({
      from: "Locaplux <noreply@locaplux.com>",
      to,
      subject,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error };
  }
}
