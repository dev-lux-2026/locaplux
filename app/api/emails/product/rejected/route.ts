import { NextResponse } from "next/server";
import { emailProductRejected } from "@/lib/emails/product/productRejected";

export async function POST(req: Request) {
  try {
    const { to, productId, reason } = await req.json();

    await emailProductRejectedEmail(to, productId, reason);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product email error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
