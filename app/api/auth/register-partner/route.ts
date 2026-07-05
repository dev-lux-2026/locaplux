import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      company,
      publicName,
      email,
      street,
      number,
      postal,
      city,
      country,
      phonePrefix,
      phone,
      vat,
      website,
      acceptPartnerTerms,
    } = body;

    // Vérification CGV Partenaires
    if (!acceptPartnerTerms) {
      return NextResponse.json(
        { error: "Vous devez accepter les CGV Partenaires." },
        { status: 400 }
      );
    }

    // Vérification champs obligatoires
    if (
      !firstName ||
      !lastName ||
      !company ||
      !publicName ||
      !email ||
      !postal ||
      !phone ||
      !phonePrefix ||
      !vat
    ) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires." },
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

    // Génération d’un mot de passe aléatoire (vendeur validé ensuite par admin)
    const generatedPassword = randomUUID().slice(0, 12);
    const hashed = await bcrypt.hash(generatedPassword, 10);

    // Création du compte vendeur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        company,
        publicName,
        street,
        number,
        postal,
        city,
        country,
        phonePrefix,
        phone,
        vat,
        website,
        role: "partner",
        status: "pending",
        emailVerified: null,
        acceptedPartnerTermsAt: new Date(),
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
          <p>Votre compte partenaire est en attente de validation par un administrateur.</p>
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
