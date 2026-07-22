import { NextResponse } from "next/server";

// ─────────────────────────────────────────────
// GET — Racine de l’API catégories
// ─────────────────────────────────────────────
export async function GET(req: Request) {
  return NextResponse.json({
    message: "Categories API root",
  });
}
