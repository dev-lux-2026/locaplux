// lib/categories/helpers.ts

import CATEGORY_TAGS from "./index";
import { CategoryEntry, CategorySlug } from "./types";

/**
 * Normalise un texte pour la détection
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Trouve une catégorie depuis un slug
 */
export function findCategoryFromSlug(slug: string): CategoryEntry | null {
  const key = slug as CategorySlug;
  return CATEGORY_TAGS[key] ?? null;
}

/**
 * Détection simple par texte (fallback)
 * — Ce n’est PAS ton IA, juste un helper utile
 */
export function detectCategoryFromText(text: string): CategoryEntry | null {
  const normalized = normalizeText(text);

  for (const [slug, entry] of Object.entries(CATEGORY_TAGS)) {
    const slugText = slug.replace(/_/g, " ");
    if (normalized.includes(slugText)) {
      return entry;
    }
  }

  return null;
}

/**
 * Retourne la hiérarchie complète d’une catégorie
 */
export function getCategoryHierarchy(entry: CategoryEntry) {
  return `${entry.root} > ${entry.parent} > ${entry.category}`;
}
