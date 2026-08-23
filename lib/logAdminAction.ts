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
    const adminId = session?.user?.id ?? null;

    await prisma.adminLog.create({
      data: {
        adminId: adminId ?? null,   // ⭐ FIX FINAL
        partnerId,
        action,
        comment,
      },
    });
  } catch (err) {
    console.error("Admin log error:", err);
  }
}
