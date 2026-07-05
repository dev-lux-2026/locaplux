import { NextResponse } from "next/server";
import { sendPartnerPasswordResetEmail } from "@/lib/emails/partner/sendPartnerEmails";

export async function POST(req: Request) {
  try {
    const { to, resetLink } = await req.json();

    await sendPartnerPasswordResetEmail(to, resetLink);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
