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

  // Autoriser la page maintenance (NE PAS appliquer next-intl ici)
  if (pathname.startsWith("/maintenance")) {
    return NextResponse.next();
  }

  // Autoriser l'admin pour toi
  if (pathname.startsWith("/admin")) {
    const intlResponse = await intlMiddleware(req);
    return securityMiddleware(req, intlResponse);
  }

  // Bloquer tout le reste → maintenance
  const url = req.nextUrl.clone();
  url.pathname = "/maintenance";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!api|_next|.*\\..*).*)'
  ]
};
