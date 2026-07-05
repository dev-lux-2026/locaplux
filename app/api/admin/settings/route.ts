import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.setting.findMany();
  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  const data = await req.json();

  for (const key in data) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: JSON.stringify(data[key]) },
      create: { key, value: JSON.stringify(data[key]) }
    });
  }

  return NextResponse.json({ success: true });
}
