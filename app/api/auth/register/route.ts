export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // ✅ Récupère name, ou assemble firstName et lastName si présents
    const email = body.email;
    const password = body.password;
    const acceptTerms = body.acceptTerms;
    const name = body.name || `${body.firstName || ""} ${body.lastName || ""}`.trim();

      // Vérification CGU / CGV
    if (!acceptTerms) {
      return NextResponse.json(
        { error: "DEBUG API: acceptTerms est absent ou faux dans le JSON reçu." },
        { status: 400 }
      );
    }

    // Vérification champs obligatoires
    if (!email || !password || !name) {
      return NextResponse.json(
        { 
          error: "DEBUG API: Validation échouée.", 
          details: { email: !!email, password: !!password, name: !!name, nameValue: name } 
        },
        { status: 400 }
      );
    }

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
        acceptedTermsAt: new Date(),
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

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_URL}/verify-email?token=${token}`;

    // Envoi email via Resend
    if (process.env.RESEND_API_KEY) {
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
