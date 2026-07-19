import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { getServerSession } from "next-auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  const session = await getServerSession();

  if (!session || session.user.role !== "partner") {
    return NextResponse.redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user?.stripeAccountId) {
    return NextResponse.redirect("/partner/stripe");
  }

  const account = await stripe.accounts.retrieve(user.stripeAccountId);

  // Si le compte est validé → statut vendeur actif
  if (account.details_submitted) {
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeVerified: true },
    });

    return NextResponse.redirect("/partner/dashboard");
  }

  return NextResponse.redirect("/partner/stripe");
}
