export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function GET() {
  // ✅ Retourne une réponse vide immédiate pour empêcher Vercel de tourner dans le vide pendant 300s
  return NextResponse.json({ 
    success: true, 
    message: "SSE désactivé temporairement pour l'environnement serverless Vercel Hobby" 
  });
}
