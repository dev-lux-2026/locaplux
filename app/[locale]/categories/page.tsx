"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import CategorySkeleton from "@/components/ui/CategorySkeleton";

interface AdminCategory {
  id: string;
  name: string;
  validated: boolean;
}

export default function CategoriesPage() {
  const params = useParams() as { locale: string };
  const locale = params.locale;

  const [categories, setCategories] = useState<AdminCategory[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/categories/list")
      .then((res) => res.json())
      .then((data: AdminCategory[]) =>
        setCategories(data.filter((c: AdminCategory) => c.validated))
      );
  }, []);

  // 🔥 Skeleton premium pendant le chargement
  if (!categories) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Container>
          <SectionTitle>Toutes les catégories</SectionTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Container>
        <SectionTitle>Toutes les catégories</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/${locale}/categories/${cat.id}`}
              className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <p className="text-xl font-semibold">{cat.name}</p>
            </a>
          ))}
        </div>
      </Container>
    </div>
  );
}
