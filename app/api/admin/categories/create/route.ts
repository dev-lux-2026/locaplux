import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    name,
    name_fr,
    name_en,
    name_lu,
    root,
    parent,
  } = body;

  // Vérification des champs obligatoires
  if (!name || !root || !parent) {
    return NextResponse.json(
      {
        error:
          "Champs obligatoires manquants : name, root, parent doivent être fournis.",
      },
      { status: 400 }
    );
  }

  // Génération d'un ID UUID car Prisma n'a pas de @default(uuid())
  const id = randomUUID();

  const category = await prisma.category.create({
    data: {
      id, // obligatoire
      name,
      name_fr: name_fr ?? null,
      name_en: name_en ?? null,
      name_lu: name_lu ?? null,
      root,
      parent,
      active: true,
      validated: false,
    },
  });

  return NextResponse.json(category);
}
