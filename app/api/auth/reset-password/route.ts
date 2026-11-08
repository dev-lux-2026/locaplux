import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Le jeton et le nouveau mot de passe sont requis." },
        { status: 400 }
      );
    }

    // 1. Rechercher le token dans la table dédiée
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetRecord || resetRecord.expires < new Date()) {
      return NextResponse.json(
        { error: "Ce lien de réinitialisation est invalide ou a expiré." },
        { status: 400 }
      );
    }

    // 2. Trouver l'utilisateur associé via l'email du token
    const user = await prisma.user.findUnique({
      where: { email: resetRecord.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 400 }
      );
    }

    // 3. Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Mettre à jour le mot de passe de l'utilisateur
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // 5. Supprimer le token utilisé pour qu'il ne serve plus
    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Erreur lors de la réinitialisation du mot de passe :", err);
    return NextResponse.json(
      { error: "Une erreur technique est survenue." },
      { status: 500 }
    );
  }
}