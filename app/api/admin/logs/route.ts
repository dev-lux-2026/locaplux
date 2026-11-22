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

    const rawId = session?.user?.id;
    const rawEmail = session?.user?.email;

    let adminUser: { id: string } | null = null;

    if (rawId) {
      adminUser = await prisma.user.findUnique({
        where: { id: String(rawId) },
        select: { id: true },
      });
    }

    if (!adminUser && rawEmail) {
      adminUser = await prisma.user.findUnique({
        where: { email: String(rawEmail) },
        select: { id: true },
      });
    }

    if (!adminUser?.id) {
      console.warn(
        "Admin log skipped: no matching User found in DB for session",
        { id: rawId, email: rawEmail }
      );
      return;
    }

    await prisma.adminLog.create({
      data: {
        adminId: adminUser.id,
        partnerId,
        action,
        comment,
      },
    });
  } catch (err) {
    console.error("Admin log error:", err);
  }
}