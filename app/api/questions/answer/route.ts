import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// 🔒 Filtre anti-détournement renforcé (même que F11.3)
async function sanitizeMessage(message: string) {
  let clean = message;

  const partners = await prisma.user.findMany({
    where: { role: "partner" },
    select: { name: true, company: true },
  });

  const patterns = [
    /\b[\w.%+-]+@[\w.-]+\.\w{2,}\b/gi,
    /\b[\w.%+-]+\s*(?:at|@)\s*[\w.-]+\s*(?:dot|point|\.)\s*\w{2,}\b/gi,
    /\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}/gi,
    /\b(zero|un|deux|trois|quatre|cinq|six|sept|huit|neuf)(\s|-)?(zero|un|deux|trois|quatre|cinq|six|sept|huit|neuf)+\b/gi,
    /https?:\/\/\S+/gi,
    /www\.\S+/gi,
    /\b(bit\.ly|tinyurl\.com|t\.co|wa\.me|linktr\.ee|goo\.gl)\/\S+/gi,
    /\b(instagram|facebook|whatsapp|tiktok|snapchat|telegram|messenger)\b/gi,
    /\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/gi,
    /\b(rue|avenue|boulevard|impasse|chemin|route|allée|place)\b\s+\w+/gi,
    /\b(L-\d{4}|\d{4,5})\b/gi,
    /data:image\/png;base64,[A-Za-z0-9+/=]+/gi,
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
      return NextResponse.json(
        { error: "Vous devez être connecté." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { questionId, answer } = body;

    if (!questionId || !answer) {
      return NextResponse.json(
        { error: "Question et réponse requises." },
        { status: 400 }
      );
    }

    // Vérifier la question
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question introuvable." },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est bien le partenaire concerné
    if (question.partnerId !== session.user.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à répondre à cette question." },
        { status: 403 }
      );
    }

    // 🔒 Filtrer la réponse (anti-détournement)
    const safeAnswer = await sanitizeMessage(answer);

    // Enregistrer la réponse
    const updated = await prisma.question.update({
      where: { id: questionId },
      data: {
        answer: safeAnswer,
        answeredAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, question: updated });
  } catch (error) {
    console.error("Erreur API /questions/answer :", error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
