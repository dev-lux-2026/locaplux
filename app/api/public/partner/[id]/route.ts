import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const partner = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      publicName: true,
      company: true,
      street: true,
      number: true,
      postal: true,
      city: true,
      country: true,
      phonePrefix: true,
      phone: true,
      website: true,
      description: true,
      avatar: true,
      bannerUrl: true,
      folderUrl: true,
      folderUpdatedAt: true,
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