// /lib/emails/sendTemplatedEmail.ts
import { Resend } from "resend";
import { render } from "@react-email/render";
import { EmailTemplate } from "./emailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  try {
    const html = render(
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
