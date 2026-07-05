import { NextResponse } from "next/server";
import { sendPartnerKycApprovedEmail } from "@/lib/emails/partner/sendPartnerEmails";

export async function POST(req: Request) {
  try {
    const { to, name } = await req.json();

    await sendPartnerKycApprovedEmail(to, name);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
