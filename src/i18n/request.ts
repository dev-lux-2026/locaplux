import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const supportedLocales = ["fr", "en", "lu"];
  if (!supportedLocales.includes(locale)) locale = "fr";

  const home = (await import(`../../app/[locale]/messages/${locale}/${locale}.json`)).default;
  const homeConnected = (await import(`../../app/[locale]/messages/${locale}/HomeConnected.json`)).default;

  return {
    locale,
    messages: { ...home, ...homeConnected }
  };
});
