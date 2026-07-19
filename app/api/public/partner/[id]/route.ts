import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, context) {
  const { id } = params;

  const partner = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      publicName: true,
      company: true,
      city: true,
      country: true,
      description: true,
      avatar: true,
      bannerUrl: true,
      createdAt: true,
      status: true,
    },
  });

  if (!partner) {
    return NextResponse.json(null, { status: 404 });
  }

  // On n'affiche que les partenaires approuvés / actifs
  if (!["approved", "active"].includes(partner.status)) {
    return NextResponse.json(null, { status: 404 });
  }

  return NextResponse.json(partner);
}
