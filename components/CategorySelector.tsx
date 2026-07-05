"use client";

import { useCategories } from "@/hooks/useCategories";

export default function CategorySelector({
  autoCategoryId,
  defaultCategoryId,
}: {
  autoCategoryId?: string | null;
  defaultCategoryId?: string | null;
}) {
  const { categories, loading } = useCategories();

  if (loading) return <p>Chargement des catégories...</p>;

  return (
    <select
      name="categoryId"
      className="border p-2 w-full"
      defaultValue={autoCategoryId || defaultCategoryId || ""}
    >
      <option value="">Sélectionner une catégorie</option>

      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
