import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { getServerSession } from "next-auth";

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(STRIPE_KEY);

export async function GET(req: Request) {
  const session = await getServerSession();

  if (!session?.user?.role || session.user.role !== "partner") {
    return NextResponse.redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user?.stripeAccountId) {
    return NextResponse.redirect("/partner/stripe");
  }

  const account = await stripe.accounts.retrieve(user.stripeAccountId);

  if (account.details_submitted) {
    return NextResponse.redirect("/partner/dashboard");
  }

  return NextResponse.redirect("/partner/stripe");
}
