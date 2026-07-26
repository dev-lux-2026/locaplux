import { NextResponse } from "next/server";
import { sendVatCheckFailedAlert } from "@/lib/emails/alerts/sendVatCheckFailed";

export async function POST(req: Request) {
  try {
    const { company, publicName, vat, email } = await req.json();

    await sendVatCheckFailedAlert({
      company,
      publicName,
      vat,
      email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Alert email error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
