import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = session.user.id;

  // Récupération des données utilisateur
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
  messages: true,
  questionsBuyer: true,
  questionsPartner: true,
  wishlists: true,
}
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  // Structure d’export
  const exportData = {
    generatedAt: new Date().toISOString(),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    orders: user.orders,
    messages: user.messages,
    questions: user.questions,
    wishlist: user.wishlist,
    addresses: user.addresses,
  };

  const json = JSON.stringify(exportData, null, 2);

  return new NextResponse(json, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="locaplux-export-${userId}.json"`,
    },
  });
}
