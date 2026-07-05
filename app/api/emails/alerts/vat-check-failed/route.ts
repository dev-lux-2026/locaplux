import { NextResponse } from "next/server";
import { sendVatCheckFailedEmail } from "@/lib/emails/alerts/sendVatCheckFailed";

export async function POST(req: Request) {
  try {
    const { to, vatNumber, companyName } = await req.json();

    await sendVatCheckFailedEmail(to, vatNumber, companyName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Alert email error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
