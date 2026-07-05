import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import Header from "@/components/Header";

export default async function LocaleLayout({ children, params }) {
  const locale = params.locale;

  try {
    const home = (await import(`./messages/${locale}/${locale}.json`)).default;
    const homeConnected = (await import(`./messages/${locale}/HomeConnected.json`)).default;

    return (
      <NextIntlClientProvider locale={locale} messages={{ ...home, ...homeConnected }}>
        <Header />
        <main>
          {children}
        </main>
      </NextIntlClientProvider>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}
