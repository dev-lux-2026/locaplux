// lib/categories/categoryAutoDetect.ts — VERSION PREMIUM 2025 FIXÉE
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Normalisation d’un tag
 */
function normalize(tag: string): string {
  return tag
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .replace(/s$/, "");
}

// Dictionnaire : tag → catégorie FR
const TAG_MAP: Record<string, string> = {
  phone: "Téléphonie",
  mobile: "Téléphonie",
  smartphone: "Téléphonie",
  iphone: "Téléphonie",
  android: "Téléphonie",
  samsung: "Téléphonie",

  laptop: "Informatique",
  notebook: "Informatique",
  computer: "Informatique",
  pc: "Informatique",
  monitor: "Informatique",
  screen: "Informatique",
  keyboard: "Informatique",
  mouse: "Informatique",

  speaker: "Audio",
  headphones: "Audio",
  earphones: "Audio",
  audio: "Audio",
  headset: "Audio",

  furniture: "Meubles",
  table: "Meubles",
  chair: "Meubles",
  sofa: "Meubles",
  couch: "Meubles",
  armchair: "Meubles",
  desk: "Meubles",

  microwave: "Électroménager",
  oven: "Électroménager",
  fridge: "Électroménager",
  refrigerator: "Électroménager",
  washingmachine: "Électroménager",
  dryer: "Électroménager",
  vacuum: "Électroménager",

  garden: "Jardin",
  lawnmower: "Jardin",
  grill: "Jardin",
  barbecue: "Jardin",

  bike: "Sport",
  bicycle: "Sport",
  football: "Sport",
  basketball: "Sport",
  ski: "Sport",
  snowboard: "Sport",

  pen: "Papeterie",
  pencil: "Papeterie",
  marker: "Papeterie",
  felt: "Papeterie",
  feltpen: "Papeterie",
  highlighter: "Papeterie",
  stylus: "Papeterie",
  office: "Papeterie",
  stationery: "Papeterie",
  notebookpaper: "Papeterie",
  paper: "Papeterie",
  eraser: "Papeterie",
  ruler: "Papeterie",
  scissors: "Papeterie",
};

/**
 * Détection via tags Cloudinary / IA
 */
export async function detectCategoryIdFromTags(tags: any) {
  // 🔥 Correction : forcer tags à être un tableau
  if (!Array.isArray(tags) || tags.length === 0) return null;

  const normalized = tags.map((t) => normalize(String(t)));

  const scores: Record<string, number> = {};

  for (const tag of normalized) {
    const category = TAG_MAP[tag];
    if (!category) continue;
    scores[category] = (scores[category] || 0) + 1;
  }

  if (Object.keys(scores).length === 0) return null;

  const bestCategory = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];

  // Vérifier si la catégorie existe
  let category = await prisma.category.findFirst({
    where: { name: bestCategory },
  });

  // Sinon la créer automatiquement (🔥 version compatible 2025)
  if (!category) {
    category = await prisma.category.create({
      data: {
        id: bestCategory.toLowerCase().replace(/\s+/g, "-"),
        name: bestCategory,
        root: bestCategory.toLowerCase(),
        parent: "other",
        active: true,
      },
    });
  }

  return category.id;
}
