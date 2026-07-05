import { NextResponse } from "next/server";
import { sendOrderShippedEmail } from "@/lib/emails/order/sendOrderEmails";

export async function POST(req: Request) {
  try {
    const { to, orderId, tracking } = await req.json();

    await sendOrderShippedEmail(to, orderId, tracking);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order email error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
