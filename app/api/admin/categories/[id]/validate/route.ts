import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// ─────────────────────────────────────────────
// PATCH — Valider une catégorie
// ─────────────────────────────────────────────
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  // Mise à jour : validated = true
  const updated = await prisma.category.update({
    where: { id },
    data: {
      validated: true,
    },
  });

  return NextResponse.json(updated);
}
