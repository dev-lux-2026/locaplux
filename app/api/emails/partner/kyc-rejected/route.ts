import { NextResponse } from "next/server";
import { sendPartnerKycRejectedEmail } from "@/lib/emails/partner/sendPartnerEmails";

export async function POST(req: Request) {
  try {
    const { to, name, reason } = await req.json();

    await sendPartnerKycRejectedEmail(to, name, reason);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
