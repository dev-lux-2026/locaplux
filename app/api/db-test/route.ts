// app/api/db-test/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT NOW()`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DB TEST ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}