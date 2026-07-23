import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const partners = await prisma.user.findMany({
    where: { role: "partner" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      status: true,
      createdAt: true,

      publicName: true,
      company: true,
      vat: true,
      vatCheckFailed: true,

      phonePrefix: true,
      phone: true,

      street: true,
      number: true,
      postal: true,
      city: true,
      country: true,

      website: true,

      freeProductLimit: true,
      freeDaysLimit: true,
      freeUntil: true,

      commissionRate: true,

      _count: { select: { products: true } },
    },
  });

  return NextResponse.json(partners);
}
