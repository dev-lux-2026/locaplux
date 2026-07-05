// app/api/auto-category/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { inferCategoryUnified, normalize } from "@/lib/autoCategory";

export async function POST(req: Request) {
  try {
    const { name, description, imageTags } = await req.json();

    // 1) Validation minimale
    if (!name && !description && (!imageTags || imageTags.length === 0)) {
      return NextResponse.json(
        { error: "Missing product data" },
        { status: 400 }
      );
    }

    // 2) IA → fusion texte + image (avec source + confiance)
    const detected = await inferCategoryUnified({
      name: name || "",
      description: description || "",
      imageTags: imageTags || [],
    });

    // 3) Fallback si rien trouvé
    const finalCategory = detected || {
      category: "Inclassables",
      parent: "Autres",
      root: "Divers",
      source: "fallback",
      confidence: 20,
    };

    // 4) Normalisation → ID propre
    const categoryId = normalize(finalCategory.category);

    // 5) Vérifier si la catégorie existe déjà
    let category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    // 6) Sinon → création automatique
    if (!category) {
      category = await prisma.category.create({
        data: {
          id: categoryId,
          name: finalCategory.category,
          parent: finalCategory.parent,
          root: finalCategory.root,
          active: false, // admin validera
        },
      });
    }

    // 7) Retourner la catégorie détectée + infos IA complètes
    return NextResponse.json(
      {
        categoryId: category.id,
        category: category.name,
        parent: category.parent,
        root: category.root,

        // 🔥 Infos IA complètes
        source: finalCategory.source,
        confidence: finalCategory.confidence,

        // 🔥 Debug complet (visible uniquement pour admin côté front)
        debug: {
          input: {
            name,
            description,
            imageTags: imageTags || [],
          },
          detected,      // résultat brut IA
          finalCategory, // catégorie finale utilisée
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("AUTO-CATEGORY ERROR:", err);
    return NextResponse.json(
      { error: "Internal error in auto-category" },
      { status: 500 }
    );
  }
}
