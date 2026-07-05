import fr from "@/locales/fr/categories.json";
import en from "@/locales/en/categories.json";
import lu from "@/locales/lu/categories.json";

const dictionaries: any = { fr, en, lu };

export function translateCategory(nameFr: string, lang: string = "fr") {
  const dict = dictionaries[lang] || dictionaries["fr"];
  return dict[nameFr] || nameFr;
}
