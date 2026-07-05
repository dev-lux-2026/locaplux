// /lib/tokens.ts
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

/**
 * Génère un token sécurisé pour l’activation partenaire.
 * Expiration : 24h
 */
export async function createPartnerActivationToken(userId: string) {
  // Supprimer uniquement les anciens tokens expirés ou utilisés
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

  const token = randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      userId,
      token,
      type: "partner_activation",
      expiresAt,
    },
  });

  return token;
}

/**
 * Vérifie un token d’activation partenaire.
 * IMPORTANT : ne pas marquer comme utilisé ici.
 */
export async function validatePartnerActivationToken(token: string) {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token }, // token est UNIQUE → findUnique OK
    include: { user: true },
  });

  if (!record) {
    return { valid: false, reason: "not_found" };
  }

  if (record.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({
      where: { id: record.id },
    });
    return { valid: false, reason: "expired", userId: record.userId };
  }

  if (record.usedAt) {
    return { valid: false, reason: "used" };
  }

  // NE PAS marquer comme utilisé ici
  return { valid: true, user: record.user };
}
