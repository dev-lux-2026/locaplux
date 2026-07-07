import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = session.user.id;
  const { preferredLanguage } = await req.json();

  if (!preferredLanguage) {
    return NextResponse.json(
      { error: "Langue manquante" },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data: { preferredLanguage },
  });

  return NextResponse.json({ success: true });
}
