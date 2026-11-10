export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body.email;
    const password = body.password;
    const acceptTerms = body.acceptTerms;
    const firstName = body.firstName || "";
    const lastName = body.lastName || "";
    const country = body.country || "";

    const name = body.name || `${firstName} ${lastName}`.trim();

    if (!acceptTerms) {
      return NextResponse.json(
        { error: "Vous devez accepter les CGU et les CGV." },
        { status: 400 }
      );
    }

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Champs manquants. Veuillez renseigner votre prénom et votre nom." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        firstName,
        lastName,
        country,
        emailVerified: null,
        acceptedTermsAt: new Date(),
      },
    });

    const token = randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const verifyUrl = `${appUrl}/api/auth/verify?token=${token}`;

    if (process.env.RESEND_API_KEY) {
      try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Locaplux <no-reply@locaplux.com>",
            to: email,
            subject: "Confirmez votre adresse email - Locaplux",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Bienvenue sur Locaplux !</h2>
                <p>Merci pour votre inscription. Pour finaliser la création de votre compte, veuillez confirmer votre adresse email :</p>
                <p style="margin: 30px 0;">
                  <a href="${verifyUrl}" style="background-color: #00A3FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                    Confirmer mon email
                  </a>
                </p>
                <p style="font-size: 12px; color: #666;">Si le bouton ne fonctionne pas, copiez-collez ce lien : <br/> ${verifyUrl}</p>
              </div>
            `,
          }),
        });

        // 🛡️ Sécurité robuste : lecture propre du texte pour éviter tout plantage JSON
        const responseText = await resendResponse.text();
        if (!resendResponse.ok) {
          console.error("🔴 Échec de l'envoi Resend :", responseText);
        }
      } catch (emailError) {
        console.error("🔴 Erreur réseau ou DNS lors de l'appel Resend :", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      email
    });

  } catch (err) {
    console.error("🔴 Erreur serveur inscription :", err);
    return NextResponse.json(
      { error: "Erreur interne." },
      { status: 500 }
    );
  }
}