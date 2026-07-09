"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import CategoryPageSkeleton from "@/components/ui/CategoryPageSkeleton";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
}

export default function CategoryPage(
  { params }: { params: { id: string; locale: string } }
) {
  const { id, locale } = params;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtres premium
  const [sort, setSort] = useState("relevance");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    async function load() {
      // Charger toutes les catégories
      const cats = await fetch("/api/categories/list").then((r) => r.json());
      const found = cats.find((c: Category) => c.id === id);
      setCategory(found ?? null);

      // Charger les produits
      const prods = await fetch(`/api/categories/${id}/products`).then((r) =>
        r.json()
      );

      setProducts(Array.isArray(prods) ? prods : []);
      setLoading(false);
    }

    load();
  }, [id]);

  const applyFilters = async () => {
    setLoading(true);

    const query = new URLSearchParams({
      sort,
      minPrice,
      maxPrice,
    });

    const prods = await fetch(
      `/api/categories/${id}/products?${query.toString()}`
    ).then((r) => r.json());

    setProducts(Array.isArray(prods) ? prods : []);
    setLoading(false);
  };

  // 🔥 SKELETON PREMIUM
  if (!category || loading) {
    return (
      <Container>
        <CategoryPageSkeleton />
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-10 space-y-10 text-gray-900 dark:text-gray-200">

        {/* HEADER PREMIUM */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold">{category.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Découvrez les produits de cette catégorie
          </p>
        </div>

        {/* FILTRES PREMIUM */}
        <div
          className="
            grid grid-cols-2 md:grid-cols-4 gap-4 
            bg-white dark:bg-[#18181A] 
            p-4 rounded-xl border border-gray-200 dark:border-white/10
          "
        >
          {/* Tri */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white dark:bg-[#1A1A1D] border border-gray-300 dark:border-white/10 text-sm"
          >
            <option value="relevance">Pertinence</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="latest">Plus récents</option>
          </select>

          {/* Prix min */}
          <input
            type="number"
            placeholder="Prix min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white dark:bg-[#1A1A1D] border border-gray-300 dark:border-white/10 text-sm"
          />

          {/* Prix max */}
          <input
            type="number"
            placeholder="Prix max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white dark:bg-[#1A1A1D] border border-gray-300 dark:border-white/10 text-sm"
          />

          {/* Bouton appliquer */}
          <button
            onClick={applyFilters}
            className="
              px-4 py-2 rounded-lg bg-black text-white 
              hover:bg-neutral-800 transition text-sm
            "
          >
            Appliquer
          </button>
        </div>

        {/* PRODUITS */}
        {products.length === 0 ? (
          <div className="text-center py-20 opacity-70">
            <p>Aucun produit trouvé dans cette catégorie.</p>
          </div>
        ) : (
          <div
            className="
              grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
              gap-6
            "
          >
            {products.map((p) => (
              <a
                key={p.id}
                href={`/${locale}/product/${p.id}`}
                className="
                  border border-gray-200 dark:border-white/10 
                  rounded-xl p-4 shadow-sm 
                  bg-white dark:bg-[#18181A] 
                  hover:shadow-xl hover:-translate-y-1 dark:hover:bg-white/5 
                  transition cursor-pointer
                "
              >
                <div className="w-full h-40 bg-gray-200 dark:bg-[#1F1F22] rounded-lg mb-3" />

                <p className="font-semibold text-black dark:text-white text-sm">
                  {p.name}
                </p>

                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {p.description?.slice(0, 50)}...
                </p>

                <p className="text-[#1A3A5F] dark:text-[#D4AF37] font-semibold mt-3 text-sm">
                  {p.price} €
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
