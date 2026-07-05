// lib/categories/types.ts

import CATEGORY_TAGS from "./index";

export type CategoryEntry = {
  category: string;
  parent: string;
  root: string;
};

export type CategorySlug = keyof typeof CATEGORY_TAGS;

export type CategoryName = CategoryEntry["category"];
export type CategoryRoot = CategoryEntry["root"];
export type CategoryParent = CategoryEntry["parent"];
