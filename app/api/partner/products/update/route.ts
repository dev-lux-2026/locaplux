import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { productUpdateSchema } from "@/lib/validation/products";

/* ------------------------------------------------------ */
/* PATCH — Mise à jour d’un produit partenaire            */
/* ------------------------------------------------------ */
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role ?? "";

    if (!session || role !== "partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const partnerId = session.user!.id;

    const json = await req.json();
    const parsed = productUpdateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      productId,
      name,
      description,
      prix_normal,
      prix_locaplux,
      prix_achat,
      stock,
      images,
      damage_type,
      damage_description,
      categoryId,
      pickup_available,
      delivery_available,
    } = parsed.data;

    // Vérification logique
    if (prix_locaplux && prix_normal && prix_locaplux > prix_normal) {
      return NextResponse.json(
        { error: "Le prix Locaplux ne peut pas dépasser le prix normal." },
        { status: 400 }
      );
    }

    // Vérifier que le produit appartient bien au partenaire
    const existing = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existing || existing.partnerId !== partnerId) {
      return NextResponse.json(
        { error: "Produit introuvable ou non autorisé." },
        { status: 404 }
      );
    }

    // Mise à jour du produit
    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(prix_normal !== undefined && { prix_normal }),
        ...(prix_locaplux !== undefined && { prix_locaplux }),
        ...(prix_achat !== undefined && { prix_achat }),
        ...(stock !== undefined && { stock }),
        ...(images && { images }),
        ...(damage_type && { damage_type }),
        ...(damage_description !== undefined && { damage_description }),

        // ⭐ FIX : Prisma n’accepte pas categoryId directement
        ...(categoryId
          ? { category: { connect: { id: categoryId } } }
          : {}),

        ...(pickup_available !== undefined && { pickup_available }),
        ...(delivery_available !== undefined && { delivery_available }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/partner/products/update error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
