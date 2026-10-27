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
    
    // Assemblage du nom complet si firstName et lastName sont fournis
    const name = body.name || `${body.firstName || ""} ${body.lastName || ""}`.trim();

    // Vérification CGU / CGV
    if (!acceptTerms) {
      return NextResponse.json(
        { error: "Vous devez accepter les CGU et les CGV." },
        { status: 400 }
      );
    }

    // Vérification des champs obligatoires
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Champs manquants. Veuillez renseigner votre nom et prénom." },
        { status: 400 }
      );
    }

    // Déclaration et vérification de l'email existant
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email." },
        { status: 400 }
      );
    }

    // Hashage natif du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur en base de données
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        emailVerified: null,
        acceptedTermsAt: new Date(),
      },
    });

    // Génération du token de vérification d'email
    const token = randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_URL}/verify-email?token=${token}`;

    // Envoi de l'email via Resend si la clé API est présente
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://resend.com", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Locaplux <no-reply@locaplux.com>",
            to: email,
            subject: "Confirmez votre adresse email",
            html: `
              <p>Bienvenue sur Locaplux !</p>
              <p>Veuillez confirmer votre adresse email :</p>
              <p><a href="${verifyUrl}">Confirmer mon email</a></p>
            `,
          }),
        });
      } catch (emailError) {
        console.error("🔴 Erreur Resend :", emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur interne." },
      { status: 500 }
    );
  }
}
