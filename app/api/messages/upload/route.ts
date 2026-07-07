import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { rateLimit } from "@/lib/rateLimit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  // 🔒 Auth obligatoire
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // 🔒 Vérification utilisateur
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Utilisateur introuvable" },
      { status: 404 }
    );
  }

  // --- Rate Limit Protection ---
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Veuillez patienter une minute." },
      { status: 429 }
    );
  }

  // --- Lecture du fichier ---
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // --- Upload Cloudinary (✔ version compatible Next.js 14) ---
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `locaplux/messages/${user.id}` },
      (error, result) => {
        if (error || !result) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    stream.end(buffer);
  });

  // ✔ Next.js reçoit un vrai Response
  return NextResponse.json({
    url: (result as any).secure_url,
  });
}
