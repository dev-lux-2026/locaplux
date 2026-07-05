import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, name, acceptTerms } = body;

    // Vérification CGU / CGV
    if (!acceptTerms) {
      return NextResponse.json(
        { error: "Vous devez accepter les CGU et les CGV." },
        { status: 400 }
      );
    }

    // Vérification champs obligatoires
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Champs manquants." },
        { status: 400 }
      );
    }

    // Vérification email déjà utilisé
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email." },
        { status: 400 }
      );
    }

    // Hash du mot de passe
    const hashed = await bcrypt.hash(password, 10);

    // Création utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name,
        emailVerified: null,
        acceptedTermsAt: new Date(), // 🔥 Ajout légal
      },
    });

    // Token de vérification email
    const token = randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

    // Envoi email via Resend
    await fetch("https://api.resend.com/emails", {
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur interne." },
      { status: 500 }
    );
  }
}
