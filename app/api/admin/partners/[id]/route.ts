import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET — Détails complet du partenaire
export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const partner = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      status: true,
      createdAt: true,

      publicName: true,
      company: true,
      firstName: true,
      lastName: true,
      phonePrefix: true,
      phone: true,

      street: true,
      number: true,
      postal: true,
      city: true,
      country: true,

      website: true,

      vat: true,
      vatCheckFailed: true,

      freeProductLimit: true,
      freeDaysLimit: true,
      freeUntil: true,

      commissionRate: true,

      products: {
        select: {
          id: true,
          name: true,
          status: true,
          prix_normal: true,
          prix_locaplux: true,
          prix_achat: true,
        },
      },

      ordersAsPartner: {
        select: {
          id: true,
          total: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!partner) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(partner);
}

// PATCH — Mise à jour du statut
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { status } = await req.json();

  const validStatuses = [
    "pending",
    "approved",
    "active",
    "paused",
    "banned",
    "rejected",
  ];

  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const partner = await prisma.user.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(partner);
}

// DELETE — Interdit
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { error: "Suppression interdite — utilisez PATCH pour suspendre/bannir" },
    { status: 400 }
  );
}
