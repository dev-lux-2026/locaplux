import { categoryMapping } from "./categoryMapping";

export function detectCategoryFromTags(tags: string[]) {
  const lowerTags = tags.map((t) => t.toLowerCase());

  for (const key in categoryMapping) {
    const entry = categoryMapping[key as keyof typeof categoryMapping]; // FIX TS STRICT

    const match = entry.tags.some((tag) => lowerTags.includes(tag));
    if (match) {
      return {
        parent: entry.parent,
        child: entry.child,
      };
    }
  }

  return null;
}
