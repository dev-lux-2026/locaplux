import { NextResponse } from "next/server";
import { emailProductDisabled } from "@/lib/emails/product/productDisabled";

export async function POST(req: Request) {
  try {
    const { to, productId } = await req.json();

    await emailProductDisabledEmail(to, productId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product email error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
