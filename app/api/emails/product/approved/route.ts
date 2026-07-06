import { NextResponse } from "next/server";
import { emailProductApproved } from "@/lib/emails/product/productApproved";

export async function POST(req: Request) {
  try {
    const { to, productId } = await req.json();

   await emailProductApproved(to, productName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product email error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
