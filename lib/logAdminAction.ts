import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
    const session = await getServerSession(authOptions);

    // Si pas de session → impossible de logger un admin
    if (!session?.user?.id) {
      throw new Error("Admin ID missing — cannot log admin action");
    }

    const adminId = session.user.id; // ⭐ toujours une string

    await prisma.adminLog.create({
      data: {
        adminId,        // ⭐ conforme Prisma (String obligatoire)
        partnerId,
        action,
        comment,
      },
    });
  } catch (err) {
    console.error("Admin log error:", err);
  }
}
