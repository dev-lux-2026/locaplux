import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { antiSpamMessage } from "@/lib/security/antiSpam";

// 🔒 Filtre anti-détournement renforcé
async function sanitizeMessage(message: string) {
  let clean = message;

  const partners = await prisma.user.findMany({
    where: { role: "partner" },
    select: { name: true, company: true },
  });

  const patterns = [
    /\b[\w.%+-]+@[\w.-]+\.\w{2,}\b/gi,
    /\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}/gi,
    /https?:\/\/\S+/gi,
    /www\.\S+/gi,
    /\b(instagram|facebook|whatsapp|tiktok|snapchat|telegram|messenger)\b/gi,
    /\b(bit\.ly|tinyurl\.com|t\.co|wa\.me|linktr\.ee|goo\.gl)\/\S+/gi,
    /\b(rue|avenue|boulevard|impasse|chemin|route|allée|place)\b\s+\w+/gi,
    /\b(L-\d{4}|\d{4,5})\b/gi,
    /\b(sarl|sa|gmbh|sprl|sàrl|ltd|inc)\b/gi,
  ];

  patterns.forEach((pattern) => {
    clean = clean.replace(pattern, "[contenu masqué]");
  });

  partners.forEach((p) => {
    if (p.name) clean = clean.replace(new RegExp(p.name, "gi"), "[contenu masqué]");
    if (p.company) clean = clean.replace(new RegExp(p.company, "gi"), "[contenu masqué]");
  });

  return clean;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Vous devez être connecté." }, { status: 401 });
    }

    // Anti-spam léger
    const spamCheck = antiSpamMessage("questions", session.user.id);
    if (!spamCheck.ok) {
      return NextResponse.json({ error: spamCheck.reason }, { status: 429 });
    }

    const contentType = req.headers.get("content-type") || "";

    let productId: string;
    let message: string;
    let files: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      productId = form.get("productId") as string;
      message = form.get("message") as string;
      files = form.getAll("files").filter((f) => f instanceof File) as File[];
    } else {
      const body = await req.json();
      productId = body.productId;
      message = body.message;
    }

    if (!productId || !message) {
      return NextResponse.json({ error: "Produit et message requis." }, { status: 400 });
    }

    // Vérifier produit
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { partner: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
    }

    // Vérifier achat (post-vente)
    const order = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: "delivered",
        items: { some: { productId } },
      },
    });

    const unlocked = !!order;

    // Fichiers interdits avant achat
    if (!unlocked && files.length > 0) {
      return NextResponse.json(
        { error: "Les fichiers ne peuvent pas être envoyés avant le paiement." },
        { status: 400 }
      );
    }

    // Filtrage avant achat
    const finalMessage = unlocked ? message : await sanitizeMessage(message);

    const question = await prisma.question.create({
      data: {
        productId,
        buyerId: session.user.id,
        partnerId: product.partnerId,
        message: finalMessage,
      },
    });

    return NextResponse.json({ success: true, question });
  } catch (error) {
    console.error("Erreur API /questions/send :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
