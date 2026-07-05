import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { productUpdateSchema } from "@/lib/validation/products";
import cloudinary from "@/lib/cloudinary";

/* ------------------------------------------------------ */
/* GET — Récupérer un produit                             */
/* ------------------------------------------------------ */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!product || product.partnerId !== token.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...product,
      imageUrl: product.images?.[0] || null,
      categoryName: product.category?.name || "Sans catégorie",
    });
  } catch (error) {
    console.error("GET /api/partner/products/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/* ------------------------------------------------------ */
/* PATCH — Modifier un produit                             */
/* ------------------------------------------------------ */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product || product.partnerId !== token.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const json = await req.json();
    const parsed = productUpdateSchema.safeParse({
      ...json,
      productId: params.id,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Vérification logique prix
    if (
      data.prix_normal &&
      data.prix_locaplux &&
      data.prix_locaplux > data.prix_normal
    ) {
      return NextResponse.json(
        { error: "Le prix Locaplux ne peut pas dépasser le prix normal." },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: data.name ?? undefined,
        description: data.description ?? undefined,

        prix_normal: data.prix_normal ?? undefined,
        prix_locaplux: data.prix_locaplux ?? undefined,
        prix_achat: data.prix_achat ?? undefined,

        stock: data.stock ?? undefined,
        images: data.images ?? undefined,

        damage_type: data.damage_type ?? undefined,
        damage_description: data.damage_description ?? undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/partner/products/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/* ------------------------------------------------------ */
/* DELETE — Supprimer un produit + images Cloudinary       */
/* ------------------------------------------------------ */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product || product.partnerId !== token.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    /* ------------------------------------------------------ */
    /* 1. Suppression Cloudinary                              */
    /* ------------------------------------------------------ */
    if (product.images && product.images.length > 0) {
      for (const url of product.images) {
        try {
          // Extraire le public_id Cloudinary depuis l’URL
          const publicId = url
            .split("/")
            .slice(-1)[0]
            .split(".")[0];

          // Supprimer l’image dans le dossier mobile-capture
          await cloudinary.uploader.destroy(`mobile-capture/${publicId}`);
        } catch (err) {
          console.error("Erreur suppression Cloudinary:", err);
        }
      }
    }

    /* ------------------------------------------------------ */
    /* 2. Suppression du produit Prisma                       */
    /* ------------------------------------------------------ */
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/partner/products/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
