import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function createPartnerActivationToken(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");

  // Supprimer uniquement les tokens expirés ou déjà utilisés
  await prisma.passwordResetToken.deleteMany({
    where: {
      userId,
      type: "partner_activation",
      OR: [
        { expiresAt: { lt: new Date() } },
        { usedAt: { not: null } }
      ]
    },
  });

  // Créer le nouveau token
  await prisma.passwordResetToken.create({
    data: {
      userId,
      token,
      type: "partner_activation",
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48h
    },
  });

  return token;
}
