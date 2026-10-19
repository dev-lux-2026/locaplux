export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ContactSchema = z.object({
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, subject, message } = parsed.data;

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY manquante dans l'environnement.");
      return NextResponse.json(
        { error: "Configuration email invalide (clé manquante)." },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Locaplux Support <support@locaplux.com>",
      to: "support@locaplux.com",
      replyTo: email, // ← CORRECTION ICI
      subject: `[Support] ${subject}`,
      html: `
        <h2>Nouveau message support</h2>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Sujet :</strong> ${subject}</p>
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    if (error) {
      console.error("Erreur Resend support/contact :", error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email support." },
        { status: 500 }
      );
    }

    console.log("Email support/contact envoyé avec succès :", data);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur API support/contact :", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
