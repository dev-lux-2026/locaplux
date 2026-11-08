import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "L'adresse e-mail est requise." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Par sécurité, on renvoie un succès même si l'utilisateur n'existe pas
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Générer un token unique et sécurisé
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // Valide 1 heure

    // Supprimer les anciens tokens de cet utilisateur via son userId
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Créer le nouveau token lié à l'utilisateur
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      "https://locaplux.com";

    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: "Locaplux <contact@locaplux.com>",
      to: email,
      subject: "Réinitialisation de votre mot de passe - Locaplux",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #000;">Réinitialisation de mot de passe</h2>
          <p>Bonjour,</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Locaplux.</p>
          <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Réinitialiser mon mot de passe</a>
          </div>
          <p>Ce lien est valide pendant 1 heure. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.</p>
          <p>À très bientôt sur Locaplux !</p>
        </div>
      `,
    });

    if (error) {
      console.error("🔴 ERREUR RESEND DÉTAILLÉE :", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Erreur lors de la demande de réinitialisation :", err);
    return NextResponse.json(
      { error: "Une erreur technique est survenue." },
      { status: 500 }
    );
  }
}