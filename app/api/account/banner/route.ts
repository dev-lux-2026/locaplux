import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteFromSupabase, uploadToSupabase } from "@/lib/upload";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const uploadedUrl = await uploadToSupabase(
    file,
    `banners/${session.user.id}`
  );

  await prisma.user.update({
    where: { id: session.user.id },
    data: { bannerUrl: uploadedUrl },
  });

  return NextResponse.json({ success: true, url: uploadedUrl });
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Supprimer du storage
  await deleteFromSupabase(`banners/${session.user.id}`);

  // Reset Prisma
  await prisma.user.update({
    where: { id: session.user.id },
    data: { bannerUrl: null },
  });

  return NextResponse.json({ success: true });
}
