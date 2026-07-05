import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✔️ Next.js 15 : params doit être awaited
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { action, days } = await req.json();

  if (!["reset", "extend"].includes(action)) {
    return NextResponse.json(
      { error: "Action invalide (reset | extend)" },
      { status: 400 }
    );
  }

  let data: Record<string, any> = {};

  if (action === "reset") {
    data = {
      freeProductLimit: 0,
      freeUntil: null,
    };
  }

  if (action === "extend") {
    if (!days || typeof days !== "number" || days <= 0) {
      return NextResponse.json(
        { error: "Nombre de jours invalide pour extend" },
        { status: 400 }
      );
    }

    data = {
      freeUntil: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    };
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}
