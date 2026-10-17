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

  // 🔐 Secret : utiliser l'ancien comportement (pas de maintenance)
  if (pathname.startsWith("/320750")) {
    // On remet le chemin d'origine : /
    req.nextUrl.pathname = "/";
    // On exécute next-intl comme avant
    const intlResponse = await intlMiddleware(req);
    // On exécute la sécurité comme avant
    return securityMiddleware(req, intlResponse);
  }

  // 🛠 Autoriser la page maintenance
  if (pathname.startsWith("/maintenance")) {
    return NextResponse.next();
  }

  // 🔒 Admin (localisé)
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
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!api|_next|.*\\..*).*)'
  ]
};
