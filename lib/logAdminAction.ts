import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function logAdminAction({
  partnerId,
  action,
  comment = null,
}: {
  partnerId: string;
  action: string;
  comment?: string | null;
}) {
  try {
    // 🔐 Récupère automatiquement l’admin connecté
    const session = await getServerSession(authOptions);
    const adminId = session?.user?.id ?? null;

    await prisma.adminLog.create({
      data: {
        adminId, // ✔ sécurisé automatiquement
        partnerId,
        action,
        comment,
      },
    });
  } catch (err) {
    console.error("Admin log error:", err);
  }
}
