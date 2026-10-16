import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import securityMiddleware from './middleware-security';
import lockMiddleware from './middleware-lock'; // ← AJOUT

const intlMiddleware = createMiddleware({
  locales: ['fr', 'en', 'lu'],
  defaultLocale: 'fr',
  localePrefix: 'always'
});

export default async function middleware(req: NextRequest) {
  // 1) i18n
  const intlResponse = await intlMiddleware(req);

  // 2) protection par mot de passe
  const lockResponse = lockMiddleware(req);
  if (lockResponse) return lockResponse;

  // 3) sécurité
  return securityMiddleware(req, intlResponse);
}

export const config = {
  matcher: [
    '/((?!api|_next|.*\\..*).*)'
  ]
};
