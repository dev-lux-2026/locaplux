import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

import { rateLimit } from "@/lib/rateLimit";
import { antiAbuseIP } from "@/lib/security/antiAbuseIP";
import { productUpdateSchema } from "@/lib/validation/products";

// --- Emails ---
import { emailProductPendingAdminAlert } from "@/lib/emails/product/productPendingAdminAlert";

export async function POST(req: Request) {
  // --- IP extraction ---
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  // --- Rate Limit Protection ---
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Veuillez patienter une minute." },
      { status: 429 }
    );
  }

  // --- Anti‑abuse IP global ---
  const abuseCheck = antiAbuseIP(ip);
  if (!abuseCheck.ok) {
    return NextResponse.json(
      { error: abuseCheck.reason },
      { status: 429 }
    );
  }

  // --- Auth partenaire (CORRECT pour App Router) ---
  const token = await getToken({ req });

  if (!token || token.role !== "partner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const partnerId = token.id;

  // --- Zod Validation ---
  const json = await req.json();
  const parsed = productUpdateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { productId, ...updates } = parsed.data;

  // --- Vérification ownership produit ---
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { partner: true },
  });

  if (!product) {
    return NextResponse.json(
      { error: "Produit introuvable" },
      { status: 404 }
    );
  }

  if (product.partnerId !== partnerId) {
    return NextResponse.json(
      { error: "Vous ne pouvez modifier que vos propres produits" },
      { status: 403 }
    );
  }

  // --- Détection de modifications importantes ---
  const requiresAdminReview =
    (updates.price && updates.price !== product.price) ||
    (updates.description && updates.description !== product.description) ||
    (updates.images && JSON.stringify(updates.images) !== JSON.stringify(product.images)) ||
    (updates.categoryName && updates.categoryName !== product.categoryName);

  // --- Mise à jour du produit ---
  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      ...updates,
      status: requiresAdminReview ? "pending" : product.status,
    },
  });

  // --- Email admin si repasse en pending ---
  if (requiresAdminReview) {
    await emailProductPendingAdminAlert(product.name, token.email);
  }

  return NextResponse.json({
    updated,
    requiresAdminReview,
  });
}
