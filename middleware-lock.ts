// lock sync
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function lockMiddleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Autoriser la page de lock (localisée ou non)
  if (pathname === "/_lock" || pathname.endsWith("/_lock")) {
    return NextResponse.next();
  }

  // Vérifier l'accès
  const hasAccess =
    req.cookies.get("locaplux_access")?.value === process.env.SITE_PASSWORD;

  if (!hasAccess) {
    url.pathname = "/_lock";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
