import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import { rateLimit } from "@/lib/rateLimit";
import { antiAbuseIP } from "@/lib/security/antiAbuseIP";
import { z } from "zod";

// --- Emails ---
import { emailProductApproved } from "@/lib/emails/product/productApproved";
import { emailProductRejected } from "@/lib/emails/product/productRejected";

// --- Zod schema ---
const productValidationSchema = z.object({
  productId: z.string().min(1),
  action: z.enum(["approve", "reject"]),
  reason: z.string().optional(), // utile pour refus
});

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

  // --- Auth admin ---
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  // --- Zod Validation ---
  const json = await req.json();
  const parsed = productValidationSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { productId, action, reason } = parsed.data;

  // --- Récupération du produit ---
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

  // --- Mise à jour du statut ---
  const newStatus = action === "approve" ? "approved" : "rejected";

  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      status: newStatus,
      adminReason: reason || null,
    },
  });

  // --- Historique admin ---
  await prisma.productValidationHistory.create({
    data: {
      productId,
      adminId: session.user.id,
      action,
      reason: reason || null,
    },
  });

  // --- Envoi email partenaire ---
  if (product.partner?.email) {
    if (action === "approve") {
      await emailProductApproved(product.partner.email, product.name);
    } else {
      await emailProductRejected(product.partner.email, product.name, reason || "");
    }
  }

  return NextResponse.json({
    success: true,
    status: newStatus,
    product: updated,
  });
}
