import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Suppression des données personnelles
    await prisma.message.deleteMany({ where: { userId } });
    await prisma.question.deleteMany({ where: { userId } });
    await prisma.wishlist.deleteMany({ where: { userId } });
    await prisma.address.deleteMany({ where: { userId } });

    // Anonymisation du compte (obligation légale pour les commandes)
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: "Utilisateur supprimé",
        email: `deleted_${userId}@locaplux.com`,
        password: null,
        phone: null,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
