import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email manquant" }, { status: 400 });
  }

  // Vérifier si l'email existe déjà
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Cet email est déjà utilisé" },
      { status: 400 }
    );
  }

  // Récupérer l'utilisateur non validé
  const unverifiedUser = await prisma.user.findFirst({
    where: { emailVerified: null },
    orderBy: { createdAt: "desc" },
  });

  if (!unverifiedUser) {
    return NextResponse.json(
      { error: "Aucun compte en attente de validation" },
      { status: 400 }
    );
  }

  // Mettre à jour l'email
  await prisma.user.update({
    where: { id: unverifiedUser.id },
    data: { email },
  });

  // Supprimer anciens tokens
  await prisma.verificationToken.deleteMany({
    where: { identifier: unverifiedUser.email },
  });

  // Générer un nouveau token
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

  // Envoyer l'email
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Locaplux <no-reply@locaplux.com>",
      to: email,
      subject: "Confirmez votre nouvelle adresse email",
      html: `
        <p>Veuillez confirmer votre nouvelle adresse email :</p>
        <p><a href="${verifyUrl}">Confirmer mon email</a></p>
      `,
    }),
  });

  // 🔥 Redirection premium vers la page "email mis à jour"
  return NextResponse.redirect(new URL("/register/email-updated", req.url));
}
