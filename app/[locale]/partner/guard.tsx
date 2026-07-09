import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function partnerGuard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "partner") {
    redirect("/login");
  }

  return session;
}
