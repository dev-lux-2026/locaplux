import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import securityMiddleware from './middleware-security';

const intlMiddleware = createMiddleware({
  locales: ['fr', 'en', 'lu'],
  defaultLocale: 'fr',
  localePrefix: 'always'
});

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // 🔐 Secret : détecté même dans /fr/320750
  if (pathname.includes("320750")) {
    const intlResponse = await intlMiddleware(req);
    return securityMiddleware(req, intlResponse);
  }

  // 🛠 Autoriser la page maintenance
  if (pathname.startsWith("/maintenance")) {
    return NextResponse.next();
  }

  // 🔒 Admin
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/fr/admin") ||
    pathname.startsWith("/en/admin") ||
    pathname.startsWith("/lu/admin")
  ) {
    const intlResponse = await intlMiddleware(req);
    return securityMiddleware(req, intlResponse);
  }

  // 🚫 Tout le reste → maintenance
  const url = req.nextUrl.clone();
  url.pathname = "/maintenance";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    '/((?!api|_next|.*\\..*).*)'
  ]
};
