import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  await connectDB();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.role !== "partner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(token.id);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.email,
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: "http://localhost:3000/partner/pro/success",
    cancel_url: "http://localhost:3000/partner/pro/cancel",
  });

  return NextResponse.json({ url: session.url });
}
