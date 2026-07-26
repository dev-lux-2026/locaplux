import { NextResponse } from "next/server";
import { sendOrderReceiptEmail } from "@/lib/emails/order/sendOrderEmails";

export async function POST(req: Request) {
  try {
    const { to, orderId, total } = await req.json();

    await sendOrderReceiptEmail(to, orderId, total);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order receipt email error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
