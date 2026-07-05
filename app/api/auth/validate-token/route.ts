// /app/api/auth/validate-token/route.ts
import { NextResponse } from "next/server";
import { validatePartnerActivationToken } from "@/lib/tokens";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { valid: false, reason: "invalid" },
        { status: 400 }
      );
    }

    const result = await validatePartnerActivationToken(token);

    // Token valide
    if (result.valid) {
      return NextResponse.json({ valid: true });
    }

    // Token expiré → renvoyer userId pour renvoyer un nouveau token côté backend
    if (result.reason === "expired") {
      return NextResponse.json({
        valid: false,
        reason: "expired",
        userId: result.userId,
      });
    }

    // Token déjà utilisé
    if (result.reason === "used") {
      return NextResponse.json({
        valid: false,
        reason: "used",
      });
    }

    // Token introuvable ou invalide
    return NextResponse.json({
      valid: false,
      reason: "invalid",
    });
  } catch (error) {
    console.error("Erreur validate-token:", error);
    return NextResponse.json(
      { valid: false, reason: "server_error" },
      { status: 500 }
    );
  }
}
