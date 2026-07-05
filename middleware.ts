import createMiddleware from 'next-intl/middleware';
import securityMiddleware from './middleware-security';

const intlMiddleware = createMiddleware({
  locales: ['fr', 'en', 'lu'],
  defaultLocale: 'fr',
  localePrefix: 'always'
});

export default async function middleware(req) {
  // 1) Exécuter VRAIMENT le middleware i18n
  const intlResponse = await intlMiddleware(req);

  // 2) Passer la réponse i18n à la sécurité
  return securityMiddleware(req, intlResponse);
}

export const config = {
  matcher: [
    '/((?!api|_next|.*\\..*).*)'
  ]
};
