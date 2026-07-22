import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Récupération des données envoyées par l’admin
  const body = await req.json();

  // Contrôle strict des champs attendus
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

  // Création de la catégorie
  const category = await prisma.category.create({
    data: {
      name,
      name_fr: name_fr ?? null,
      name_en: name_en ?? null,
      name_lu: name_lu ?? null,
      root,
      parent,
      active: true,
      validated: false, // Par défaut non validée
    },
  });

  return NextResponse.json(category);
}
