import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params;
    const { status } = await req.json();

    const allowedStatuses = ["pending_delivery", "delivered", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid delivery status" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id },
      select: { id: true, partnerId: true, status: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.partnerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (order.status === "delivered") {
      return NextResponse.json(
        { error: "Order already delivered" },
        { status: 400 }
      );
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status, // ✔ seul champ valide
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("DELIVERY UPDATE ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
