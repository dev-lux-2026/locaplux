import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function logAdminAction({
  adminId,
  partnerId,
  action,
  comment,
}: {
  adminId?: string;
  partnerId: string;
  action: string;
  comment?: string | null;
}) {
  try {
    let resolvedAdminId: string | null = null;

    if (adminId) {
      const byPassedId = await prisma.user.findUnique({
        where: { id: String(adminId) },
        select: { id: true },
      });
      if (byPassedId) resolvedAdminId = byPassedId.id;
    }

    if (!resolvedAdminId) {
      const session = await getServerSession(authOptions);
      if (session?.user?.id) {
        const bySessionId = await prisma.user.findUnique({
          where: { id: String(session.user.id) },
          select: { id: true },
        });
        if (bySessionId) resolvedAdminId = bySessionId.id;
      }

      if (!resolvedAdminId && session?.user?.email) {
        const byEmail = await prisma.user.findUnique({
          where: { email: String(session.user.email) },
          select: { id: true },
        });
        if (byEmail) resolvedAdminId = byEmail.id;
      }
    }

    if (!resolvedAdminId) {
      console.warn("logAdminAction: aucun User admin trouvé pour le log");
      return;
    }

    await prisma.adminLog.create({
      data: {
        adminId: resolvedAdminId,
        partnerId,
        action,
        comment: comment ?? null,
      },
    });
  } catch (err) {
    console.error("Admin log error:", err);
  }
}