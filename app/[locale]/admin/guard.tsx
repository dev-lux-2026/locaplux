import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function adminGuard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // 🔥 Correction strict TS ici
  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  return session;
}
