import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function partnerGuard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role?.toLowerCase();

  if (role === "partner") {
    return {
      mode: "partner",
      userId: session.user.id,
      role: "partner"
    };
  }

  if (role === "admin") {
    return {
      mode: "admin-overwatch",
      userId: session.user.id,
      role: "admin"
    };
  }

  redirect("/");
}
