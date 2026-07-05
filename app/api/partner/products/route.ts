import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { productCreateSchema } from "@/lib/validation/products";

/* ------------------------------------------------------ */
/* GET — Récupérer les produits du partenaire             */
/* ------------------------------------------------------ */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const partnerId = session.user.id;

    const products = await prisma.product.findMany({
      where: { partnerId },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    });

    const formatted = products.map((p) => ({
      id: p.id,
      name: p.name,

      // ⭐ PRIX COMPLETS
      prix_normal: p.prix_normal,
      prix_locaplux: p.prix_locaplux,
      prix_achat: p.prix_achat,

      // ⭐ STOCK & DOMMAGES
      stock: p.stock,
      damage_type: p.damage_type,
      damage_description: p.damage_description,

      // ⭐ OPTIONS RETRAIT / LIVRAISON
      pickup_available: p.pickup_available,
      delivery_available: p.delivery_available,

      // ⭐ MÉTADONNÉES
      status: p.status,
      createdAt: p.createdAt,
      imageUrl: p.images?.[0] || null,
      categoryName: p.category?.name || "Sans catégorie",
      partnerId: p.partnerId,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/partner/products error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------ */
/* POST — Créer un produit (version premium Locaplux)     */
/* ------------------------------------------------------ */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const partnerId = session.user.id;
    const json = await req.json();

    // --- Validation Zod ---
    const parsed = productCreateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Données invalides",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
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

      // ⭐ NOUVEAU
      pickup_available,
      delivery_available,
    } = parsed.data;

    // --- Vérification logique ---
    if (prix_locaplux > prix_normal) {
      return NextResponse.json(
        { error: "Le prix Locaplux ne peut pas dépasser le prix normal." },
        { status: 400 }
      );
    }

    // --- Génération du slug ---
    const slugBase = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const slug = `${slugBase}-${Date.now()}`;

    // --- Création du produit ---
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,

        prix_normal,
        prix_locaplux,
        prix_achat: prix_achat ?? null,

        stock,
        images,

        condition: "new",
        damage_type,
        damage_description: damage_description || null,

        categoryId: categoryId ?? null,
        partnerId,

        // ⭐ NOUVEAU : RETRAIT / LIVRAISON
        pickup_available: pickup_available ?? true,
        delivery_available: delivery_available ?? false,

        status: "pending",
        active: true,
        isFree: false,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/partner/products error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
