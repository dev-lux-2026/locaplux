import { NextResponse } from "next/server";
import { sendOrderStatusUpdateEmail } from "@/lib/emails/order/sendOrderEmails";

export async function POST(req: Request) {
  try {
    const { to, orderId, status } = await req.json();

    await sendOrderStatusUpdateEmail(to, orderId, status);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order email error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
