import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
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

  const { conversationId } = await req.json();

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

  // 🔒 Marquer comme lus uniquement les messages reçus
  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: user.id },
      read: false,
    },
    data: { read: true },
  });

  return NextResponse.json({ ok: true });
}
