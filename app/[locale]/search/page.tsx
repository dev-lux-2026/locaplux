"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ProductGridSkeleton from "@/components/ui/ProductGridSkeleton";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filtres
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("relevance");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/categories/list")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);

    const params = new URLSearchParams({
      q: query,
      category,
      sort,
      minPrice,
      maxPrice,
    });

    const res = await fetch(`/api/search?${params.toString()}`);
    const data = await res.json();

    setResults(data);
    setLoading(false);
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 text-gray-900 dark:text-gray-200">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-8">Recherche</h1>

      {/* SEARCH BAR */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          className="
            flex-1 px-4 py-3 rounded-lg 
            bg-white dark:bg-[#18181A] 
            border border-gray-300 dark:border-white/10
            text-sm
          "
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          type="submit"
          className="
            px-6 py-3 rounded-lg bg-black text-white 
            hover:bg-neutral-800 transition text-sm
          "
        >
          Rechercher
        </button>
      </form>

      {/* FILTERS */}
      <div
        className="
          grid grid-cols-2 md:grid-cols-4 gap-4 
          bg-white dark:bg-[#18181A] 
          p-4 rounded-xl border border-gray-200 dark:border-white/10 mb-10
        "
      >
        {/* Catégorie */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white dark:bg-[#1A1A1D] border border-gray-300 dark:border-white/10 text-sm"
        >
          <option value="">Toutes catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

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
      </div>

      {/* RESULTS */}
      {loading ? (
        // 🔥 SKELETON PREMIUM
        <ProductGridSkeleton />

      ) : results.length === 0 ? (
        // EMPTY STATE PREMIUM
        <div className="text-center py-20 opacity-70">
          <Image
            src="/images/empty.png"
            alt="Aucun résultat"
            width={120}
            height={120}
            className="mx-auto mb-4 opacity-60"
          />
          <p>Aucun résultat trouvé.</p>
        </div>
      ) : (
        // GRID PREMIUM
        <div
          className="
            grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
            gap-6
          "
        >
          {results.map((p) => (
            <a
              key={p.id}
              href={`/product/${p.id}`}
              className="
                border border-gray-200 dark:border-white/10 
                rounded-xl p-4 shadow-sm 
                bg-white dark:bg-[#18181A] 
                hover:shadow-xl hover:-translate-y-1 dark:hover:bg-white/5 
                transition cursor-pointer
              "
            >
              <div className="w-full h-44 bg-gray-200 dark:bg-[#1F1F22] rounded-lg mb-3" />

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
  );
}
