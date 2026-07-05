import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { rateLimit } from "@/lib/rateLimit";
import { antiSpamMessage } from "@/lib/security/antiSpam";
import { antiAbuseIP } from "@/lib/security/antiAbuseIP";

import { messageCreateSchema } from "@/lib/validation/messages";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Veuillez patienter une minute." },
      { status: 429 }
    );
  }

  const abuseCheck = antiAbuseIP(ip);
  if (!abuseCheck.ok) {
    return NextResponse.json(
      { error: abuseCheck.reason },
      { status: 429 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Utilisateur introuvable" },
      { status: 404 }
    );
  }

  const spamCheck = antiSpamMessage(ip, user.id);
  if (!spamCheck.ok) {
    return NextResponse.json(
      { error: spamCheck.reason },
      { status: 429 }
    );
  }

  const json = await req.json();
  const parsed = messageCreateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { conversationId, text, image } = parsed.data;

  // 🔒 Vérification d’accès à la conversation
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation introuvable" },
      { status: 404 }
    );
  }

  if (![conversation.buyerId, conversation.partnerId].includes(user.id)) {
    return NextResponse.json(
      { error: "Accès refusé" },
      { status: 403 }
    );
  }

  // --- Création du message ---
  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: user.id,
      text: text || null,
      image: image || null,
    },
  });

  // --- Mise à jour de la conversation ---
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json(message);
}
