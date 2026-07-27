import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { emailOrderStatusUpdate } from "@/lib/emails/order/orderStatusUpdate";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { orderId, status } = body;

  if (!orderId || !status) {
    return NextResponse.json(
      { error: "Missing orderId or status" },
      { status: 400 }
    );
  }

  const allowedStatuses = ["pending", "confirmed", "delivered", "cancelled"];
  if (!allowedStatuses.includes(status)) {
    return NextResponse.json(
      { error: "Invalid status value" },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      items: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.partnerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  // ✔ Correction : 3 arguments
  await emailOrderStatusUpdate(order.user.email, updated, status);

  return NextResponse.json({ success: true, order: updated });
}
