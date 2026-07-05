import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { CURRENT_TERMS_VERSION } from "@/lib/terms";

export async function POST() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      acceptedTermsAt: new Date(),
      termsVersion: CURRENT_TERMS_VERSION, // 🔥 version CGU/CGV acheteurs
    },
  });

  return NextResponse.json({ success: true });
}
