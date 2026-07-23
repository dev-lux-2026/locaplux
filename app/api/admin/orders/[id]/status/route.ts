import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// PATCH — Mettre à jour le statut d’une commande
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id; // UUID string

  const { status } = await req.json();

  if (!status) {
    return NextResponse.json(
      { error: "Le champ 'status' est obligatoire." },
      { status: 400 }
    );
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updated);
}
