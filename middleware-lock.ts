import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function lockMiddleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (url.pathname === "/_lock") {
    return NextResponse.next();
  }

  const hasAccess =
    req.cookies.get("locaplux_access")?.value === process.env.SITE_PASSWORD;

  if (!hasAccess) {
    url.pathname = "/_lock";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
