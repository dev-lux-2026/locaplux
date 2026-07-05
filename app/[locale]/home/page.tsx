import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <HomePageClient onboardingIncomplete={false} />;
  }

  const userId = session.user.id;

  const [addressCount, user] = await Promise.all([
    prisma.address.count({ where: { userId } }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { preferredLanguage: true },
    }),
  ]);

  const onboardingIncomplete =
    addressCount < 1 || !user?.preferredLanguage;

  return (
    <HomePageClient onboardingIncomplete={onboardingIncomplete} />
  );
}
