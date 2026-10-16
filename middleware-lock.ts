import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function lockMiddleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Page de login
  if (url.pathname === "/_lock") {
    return NextResponse.next();
  }

  // Cookie d'accès
  const hasAccess = req.cookies.get("locaplux_access")?.value === process.env.SITE_PASSWORD;

  // Si pas d'accès → redirection vers la page de login
  if (!hasAccess) {
    url.pathname = "/_lock";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
