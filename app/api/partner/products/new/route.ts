// app/api/partner/products/new/route.ts — VERSION ULTRA‑PREMIUM
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

import { rateLimit } from "@/lib/rateLimit";
import { antiAbuseIP } from "@/lib/security/antiAbuseIP";
import { productCreateSchema } from "@/lib/validation/products";

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function generateUniqueSlug(base: string) {
  let slug = slugify(base);
  let exists = await prisma.product.findUnique({ where: { slug } });

  let counter = 1;
  while (exists) {
    const newSlug = `${slug}-${counter}`;
    exists = await prisma.product.findUnique({ where: { slug: newSlug } });
    if (!exists) return newSlug;
    counter++;
  }

  return slug;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Veuillez patienter une minute." },
      { status: 429 }
    );
  }

  const abuseCheck = antiAbuseIP(ip);
  if (!abuseCheck.ok) {
    return NextResponse.json(
      { error: abuseCheck.reason },
      { status: 429 }
    );
  }

  const token = await getToken({ req });
  if (!token || token.role !== "partner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const partnerId = token.id;

  const json = await req.json();
  const parsed = productCreateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const origin = req.headers.get("origin") || "http://localhost:3000";

  // ⭐ AUTO-CATEGORY (texte + image + IA locale)
  const autoRes = await fetch(`${origin}/api/auto-category`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      autoCategoryIdFromImage: data.autoCategoryIdFromImage || null,
    }),
  });

  const auto = await autoRes.json();
  const finalCategoryId = auto.categoryId || null;

  if (data.prix_locaplux > data.prix_normal) {
    return NextResponse.json(
      { error: "Le prix Locaplux ne peut pas dépasser le prix normal." },
      { status: 400 }
    );
  }

  const slug = await generateUniqueSlug(data.name);

  const product = await prisma.product.create({
    data: {
      partnerId,

      name: data.name,
      slug,
      description: data.description || null,

      prix_normal: data.prix_normal,
      prix_locaplux: data.prix_locaplux,
      prix_achat: data.prix_achat ?? null,

      stock: data.stock,
      images: data.images,

      condition: "new",
      damage_type: data.damage_type,
      damage_description: data.damage_description || null,

      // ⭐ Assignation automatique (catégorie toujours existante)
      categoryId: finalCategoryId,

      status: "pending",
      active: true,
      isFree: false,
    },
  });

  return NextResponse.json(product);
}
