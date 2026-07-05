import prisma from "@/lib/prisma";

export async function logAdminAction({
  adminId,
  partnerId,
  action,
  comment,
}: {
  adminId: string;
  partnerId: string;
  action: string;
  comment?: string;
}) {
  await prisma.adminLog.create({
    data: {
      adminId,
      partnerId,
      action,
      comment,
    },
  });
}
