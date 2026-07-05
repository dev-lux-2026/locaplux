import { NextResponse } from "next/server";
import { sendPartnerWelcomeEmail } from "@/lib/emails/partner/sendPartnerEmails";

export async function POST(req: Request) {
  try {
    const { to, name } = await req.json();

    await sendPartnerWelcomeEmail(to, name);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
