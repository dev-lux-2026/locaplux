import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";

type VerifyEmailProps = {
  searchParams: {
    token?: string;
  };
  params: {
    locale: string;
  };
};

export default async function VerifyEmailPage({ searchParams, params }: VerifyEmailProps) {
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

  const user = await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({ where: { token } });

  await signIn("credentials", {
    email: user.email,
    password: user.password,
    redirect: false,
  });

  redirect(`/${locale}/account/onboarding/address`);
}
