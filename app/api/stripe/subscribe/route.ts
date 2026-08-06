import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Vérification correcte du JWT NextAuth
  if (!token || token.role !== "partner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Récupération correcte de l'utilisateur via Prisma
  const user = await prisma.user.findUnique({
    where: { id: token.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

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
    success_url: `${process.env.NEXTAUTH_URL}/partner/pro/success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/partner/pro/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
