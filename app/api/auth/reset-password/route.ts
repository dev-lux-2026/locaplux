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

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (
      !resetRecord ||
      resetRecord.expiresAt < new Date() ||
      resetRecord.usedAt !== null
    ) {
      return NextResponse.json(
        { error: "Ce lien de réinitialisation est invalide, a expiré ou a déjà été utilisé." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
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