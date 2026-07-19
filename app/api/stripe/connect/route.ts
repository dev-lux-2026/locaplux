import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { getServerSession } from "next-auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const session = await getServerSession();

  if (!session || session.user.role !== "partner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  // Créer un compte Stripe si pas encore créé
  if (!user.stripeAccountId) {
    const account = await stripe.accounts.create({
      type: "express",
      email: user.email,
    });

    user = await prisma.user.update({
      where: { id: user.id },
      data: { stripeAccountId: account.id },
    });
  }

  // Créer un lien d’onboarding
  const link = await stripe.accountLinks.create({
    account: user.stripeAccountId,
    refresh_url: `${process.env.NEXTAUTH_URL}/partner/stripe`,
    return_url: `${process.env.NEXTAUTH_URL}/api/stripe/callback`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: link.url });
}
