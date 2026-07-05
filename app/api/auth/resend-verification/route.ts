import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function GET(req) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email manquant" }, { status: 400 });
  }

  const token = randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60);

  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Locaplux <no-reply@locaplux.com>",
      to: email,
      subject: "Confirmez votre adresse email",
      html: `
        <p>Veuillez confirmer votre adresse email :</p>
        <p><a href="${verifyUrl}">Confirmer mon email</a></p>
      `,
    }),
  });

  return NextResponse.redirect("/register/check-email");
}
