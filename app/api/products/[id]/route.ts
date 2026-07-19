import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Missing product ID" },
      { status: 400 }
    );
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      partner: true,
    },
  });

  if (!product) {
    return NextResponse.json(
      { error: "Produit introuvable" },
      { status: 404 }
    );
  }

  // ❌ Empêcher l’accès aux produits non validés ou inactifs
  if (product.status !== "validated" || !product.active) {
    return NextResponse.json(
      { error: "Produit non disponible" },
      { status: 403 }
    );
  }

  // ❌ Empêcher l’accès aux produits sans image
  if (!product.images || product.images.length === 0) {
    return NextResponse.json(
      { error: "Produit incomplet (pas d’image)" },
      { status: 403 }
    );
  }

  // ❌ Empêcher l’accès aux produits sans catégorie
  if (!product.category) {
    return NextResponse.json(
      { error: "Produit sans catégorie" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    id: product.id,
    name: product.name,
    description: product.description,
    prix_normal: product.prix_normal,
    prix_locaplux: product.prix_locaplux,
    prix_achat: product.prix_achat,
    stock: product.stock,
    images: product.images,

    pickup_available: product.pickup_available,
    delivery_available: product.delivery_available,
    condition: product.condition,
    damage_type: product.damage_type,
    damage_description: product.damage_description,
    reason: product.reason,

    category: {
      id: product.category.id,
      name: product.category.name,
    },

    partner: {
      id: product.partner?.id,
      publicName: product.partner?.publicName,
      isPro: product.partner?.role === "pro",
    },

    status: product.status,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  });
}
