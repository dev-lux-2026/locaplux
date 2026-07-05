// /app/api/auth/create-password/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validatePartnerActivationToken } from "@/lib/tokens";
import bcrypt from "bcryptjs";

// 🔐 Validation moderne du mot de passe (Option A)
function validatePassword(password: string): string | null {
  if (!password || password.length < 12) {
    return "Le mot de passe doit contenir au moins 12 caractères.";
  }

  const blacklist = [
    "password",
    "123456",
    "azerty",
    "qwerty",
    "locaplux",
    "admin",
    "welcome",
    "motdepasse",
  ];

  const lower = password.toLowerCase();
  if (blacklist.some((bad) => lower.includes(bad))) {
    return "Ce mot de passe est trop faible ou trop courant.";
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: "Requête invalide." },
        { status: 400 }
      );
    }

    // 🔐 Vérification du mot de passe (Option A)
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json(
        { success: false, message: passwordError },
        { status: 400 }
      );
    }

    // Vérifier le token
    const result = await validatePartnerActivationToken(token);

    if (!result.valid) {
      return NextResponse.json(
        { success: false, message: "Token invalide ou expiré." },
        { status: 400 }
      );
    }

    const user = result.user;

    // Hacher le mot de passe
    const hashed = await bcrypt.hash(password, 10);

    // Mettre à jour l'utilisateur
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        status: "active",
        acceptedPartnerTermsAt: new Date(),
        emailVerified: new Date(), // <-- CRUCIAL POUR ÉVITER EMAIL_NOT_VERIFIED
      },
    });

    // Marquer le token comme utilisé (usage unique)
    await prisma.passwordResetToken.update({
      where: { token },
      data: { usedAt: new Date() },
    });

    // Succès → la page React fera signIn côté client
    return NextResponse.json({
      success: true,
      email: user.email,
    });
  } catch (error) {
    console.error("Erreur create-password:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne." },
      { status: 500 }
    );
  }
}
