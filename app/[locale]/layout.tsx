import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast"; // ✨ Étape 1 : On importe le Toaster

export default async function LocaleLayout(
  { children, params }: { children: ReactNode; params: { locale: string } }
) {
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
        {/* ✨ Étape 2 : On place le composant Toaster pour qu'il écoute toutes les pages de cette langue */}
        <Toaster position="top-right" reverseOrder={false} />
      </NextIntlClientProvider>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}
