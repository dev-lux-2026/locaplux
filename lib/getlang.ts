import { cookies, headers } from "next/headers";

export function getLang() {
  const cookieStore = cookies();
  const langCookie = cookieStore.get("lang")?.value;

  if (langCookie) return langCookie;

  const h = headers();
  const headerLang = h.get("accept-language") || "";
  const browserLang = headerLang.split(",")[0].split("-")[0];

  if (["fr", "en", "lu"].includes(browserLang)) return browserLang;

  return "fr";
}
