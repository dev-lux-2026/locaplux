import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function partnerGuard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "partner") {
    redirect("/login");
  }

  return session;
}
