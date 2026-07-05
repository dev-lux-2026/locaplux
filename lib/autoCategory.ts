// lib/autoCategory.ts — VERSION FINALE AVEC SOURCE + CONFIANCE + FILTRAGE OUTDOOR

import OpenAI from "openai";
import * as categories from "./categories";

// ---------------------------------------------------------
// 1) NORMALISATION
// ---------------------------------------------------------
export function normalize(str: string | null | undefined): string {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------------------------------------------------
// 2) CHARGEMENT STATIQUE DE TOUTES LES CATÉGORIES
// ---------------------------------------------------------
function buildCategoryMap() {
  const map: Record<string, { category: string; parent: string; root: string }> = {};

  for (const moduleName of Object.keys(categories)) {
    const mod: any = (categories as any)[moduleName];
    const data = mod.default || mod;

    for (const [keyword, info] of Object.entries(data)) {
      const key = normalize(keyword);
      if (!key) continue;
      map[key] = info as any;
    }
  }

  return map;
}

const CATEGORY_MAP = buildCategoryMap();

// ---------------------------------------------------------
// 3) IA TEXTE (fallback local + embeddings OpenAI)
// ---------------------------------------------------------
const openai =
  process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

type EmbeddingVector = number[];

function cosine(a: EmbeddingVector, b: EmbeddingVector): number {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

async function embed(texts: string[]): Promise<EmbeddingVector[]> {
  if (!openai) return texts.map(() => []);
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });
  return res.data.map((d) => d.embedding as EmbeddingVector);
}

// ---------------------------------------------------------
// 4) DÉTECTION TEXTE
// ---------------------------------------------------------
export async function inferCategoryFromText(text: string) {
  const norm = normalize(text);
  if (!norm) return null;

  let bestScore = 0;
  let bestMatch: any = null;

  for (const [keyword, info] of Object.entries(CATEGORY_MAP)) {
    if (norm.includes(keyword)) {
      const score = keyword.length;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = info;
      }
    }
  }

  if (bestMatch) {
    return {
      ...bestMatch,
      source: "text",
      confidence: 70,
    };
  }

  // Embeddings fallback
  if (openai) {
    const keys = Object.keys(CATEGORY_MAP);
    const inputs = [norm, ...keys];
    const vectors = await embed(inputs);

    const productVec = vectors[0];
    const keyVecs = vectors.slice(1);

    let best = { score: 0, key: null as any };

    keys.forEach((k, i) => {
      const score = cosine(productVec, keyVecs[i]);
      if (score > best.score) best = { score, key: k };
    });

    if (best.key) {
      return {
        ...CATEGORY_MAP[best.key],
        source: "text-embedding",
        confidence: Math.round(best.score * 100),
      };
    }
  }

  return null;
}

// ---------------------------------------------------------
// 5) DÉTECTION IMAGE (AVEC FILTRAGE OUTDOOR)
// ---------------------------------------------------------
const BAD_OUTDOOR_TAGS = [
  "outdoor",
  "garden",
  "patio",
  "backyard",
  "outside",
  "exterior",
  "yard",
];

export async function inferCategoryFromImageTags(tags: string[]) {
  if (!tags || tags.length === 0) return null;

  const normTags = tags.map(normalize);

  // 🔥 Si Cloudinary renvoie un tag outdoor → on ignore l’image
  if (normTags.some((t) => BAD_OUTDOOR_TAGS.includes(t))) {
    return null;
  }

  let bestScore = 0;
  let bestMatch: any = null;

  for (const [keyword, info] of Object.entries(CATEGORY_MAP)) {
    for (const tag of normTags) {
      if (tag.includes(keyword) || keyword.includes(tag)) {
        const score = keyword.length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = info;
        }
      }
    }
  }

  if (bestMatch) {
    return {
      ...bestMatch,
      source: "image",
      confidence: 85,
    };
  }

  return null;
}

// ---------------------------------------------------------
// 6) FALLBACK INTELLIGENT
// ---------------------------------------------------------
function fallbackCategory(tags: string[]) {
  if (!tags || tags.length === 0) return null;

  const t = tags.join(" ").toLowerCase();

  // Literie
  if (
    t.includes("bed") ||
    t.includes("mattress") ||
    t.includes("boxspring") ||
    t.includes("bedroom") ||
    t.includes("bedding")
  ) {
    return {
      category: "Literie",
      parent: "Maison",
      root: "Maison",
      source: "fallback",
      confidence: 40,
    };
  }

  // Électroménager
  if (
    t.includes("toaster") ||
    t.includes("blender") ||
    t.includes("mixer") ||
    t.includes("kitchen machine")
  ) {
    return {
      category: "Électroménager",
      parent: "Maison",
      root: "Maison",
      source: "fallback",
      confidence: 40,
    };
  }

  // Cuisine / Vaisselle / Ustensiles
  if (
    t.includes("kitchen") ||
    t.includes("pan") ||
    t.includes("pot") ||
    t.includes("plate") ||
    t.includes("cook")
  ) {
    return {
      category: "Maison",
      parent: "Cuisine",
      root: "Maison",
      source: "fallback",
      confidence: 40,
    };
  }

  // Meubles
  if (
    t.includes("furniture") ||
    t.includes("wood") ||
    t.includes("table") ||
    t.includes("chair") ||
    t.includes("sofa")
  ) {
    return {
      category: "Meubles",
      parent: "Maison",
      root: "Maison",
      source: "fallback",
      confidence: 40,
    };
  }

  return null;
}

// ---------------------------------------------------------
// 7) FUSION TEXTE + IMAGE + FALLBACK
// ---------------------------------------------------------
export async function inferCategoryUnified({
  name,
  description,
  imageTags,
}: {
  name: string;
  description: string;
  imageTags: string[];
}) {
  const text = `${name} ${description}`.trim();

  const textResult = await inferCategoryFromText(text);
  const imageResult = await inferCategoryFromImageTags(imageTags);

  // 1) Image → priorité si fiable
  if (imageResult) return imageResult;

  // 2) Texte
  if (textResult) return textResult;

  // 3) Fallback
  const fallback = fallbackCategory(imageTags);
  if (fallback) return fallback;

  // 4) Rien trouvé
  return null;
}
