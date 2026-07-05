import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();

  const category = await prisma.category.create({
    data,
  });

  return NextResponse.json(category);
}
