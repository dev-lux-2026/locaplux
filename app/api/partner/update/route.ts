import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import { rateLimit } from "@/lib/rateLimit";
import { antiAbuseIP } from "@/lib/security/antiAbuseIP";
import { partnerApplicationUpdateSchema } from "@/lib/validation/partner";

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

  try {
    // --- Auth admin ---
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // --- Zod Validation ---
    const json = await req.json();
    const parsed = partnerApplicationUpdateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { applicationId, action } = parsed.data;

    // --- Récupérer la demande ---
    const application = await prisma.partnerApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Demande introuvable" },
        { status: 404 }
      );
    }

    // --- Mise à jour du statut ---
    const newStatus = action === "approve" ? "approved" : "rejected";

    await prisma.partnerApplication.update({
      where: { id: applicationId },
      data: { status: newStatus },
    });

    // --- Mise à jour du rôle utilisateur ---
    await prisma.user.update({
      where: { id: application.userId },
      data: {
        role: action === "approve" ? "partner" : "user",
      },
    });

    return NextResponse.json({ success: true, status: newStatus });
  } catch (error) {
    console.error("Erreur admin update:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
