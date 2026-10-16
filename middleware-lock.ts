import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function lockMiddleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Autoriser la page de login
  if (url.pathname === "/_lock") {
    return NextResponse.next();
  }

  // Vérifier le cookie
  const hasAccess =
    req.cookies.get("locaplux_access")?.value === process.env.SITE_PASSWORD;

  if (!hasAccess) {
    url.pathname = "/_lock";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
