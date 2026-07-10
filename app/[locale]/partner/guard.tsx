import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function partnerGuard() {
  const session = await getServerSession(authOptions);

  // TS strict : session.user peut être undefined
  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "partner") {
    redirect("/");
  }

  return session;
}
