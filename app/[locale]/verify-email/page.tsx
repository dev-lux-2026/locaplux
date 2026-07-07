import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { signIn } from "@/auth"; // ✔ NextAuth v5 server-side
import { cookies } from "next/headers";

export default async function VerifyEmailPage({ searchParams, params }) {
  const { locale } = params;
  const token = searchParams.token;

  if (!token) {
    return <p>Token invalide.</p>;
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record || record.expires < new Date()) {
    return <p>Token invalide ou expiré.</p>;
  }

  // Vérifier l'utilisateur
  const user = await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });

  // Supprimer le token
  await prisma.verificationToken.delete({ where: { token } });

  // Connexion automatique via next-auth v5 (server-side)
  await signIn("credentials", {
    email: user.email,
    password: user.password,
    redirect: false,
  });

  // Redirection localisée
  redirect(`/${locale}/account/onboarding/address`);
}
