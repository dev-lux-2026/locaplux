import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const supportedLocales = ["fr", "en", "lu"];

  // 🔒 On force une locale toujours valide
  const finalLocale =
    locale && supportedLocales.includes(locale) ? locale : "fr";

  const home = (
    await import(`../../app/[locale]/messages/${finalLocale}/${finalLocale}.json`)
  ).default;

  const homeConnected = (
    await import(`../../app/[locale]/messages/${finalLocale}/HomeConnected.json`)
  ).default;

  return {
    locale: finalLocale, // 🔒 jamais undefined
    messages: { ...home, ...homeConnected }
  };
});
