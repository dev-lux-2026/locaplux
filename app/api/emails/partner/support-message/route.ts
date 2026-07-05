import { NextResponse } from "next/server";
import { sendPartnerSupportMessageEmail } from "@/lib/emails/partner/sendPartnerEmails";

export async function POST(req: Request) {
  try {
    const { to, name, email, message } = await req.json();

    await sendPartnerSupportMessageEmail(to, name, email, message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
