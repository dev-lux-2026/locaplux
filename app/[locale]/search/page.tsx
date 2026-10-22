"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
};

function SearchContent() {
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ Écoute automatique du paramètre "q" envoyé par la Home
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les catégories au démarrage
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`/api/categories/list`); // Alignement sur ta vraie route d'API
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur chargement catégories :", err);
      }
    }
    loadCategories();
  }, []);

  // ✅ Déclencher automatiquement la recherche si un mot-clé est présent dans l'URL
  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      executeSearch(queryParam, category);
    }
  }, [searchParams]);

  async function executeSearch(searchQuery: string, catId: string) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/search?query=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(catId)}`
      );
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur recherche :", err);
      setResults([]);
    }
    setLoading(false);
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Met à jour l'URL du navigateur pour garder la cohérence
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.replace(`/${locale}/search?${params.toString()}`);
    executeSearch(query, category);
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Recherche</h1>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block mb-1 text-sm font-medium">Mot-clé</label>
          <input
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-[#1A1A1D] border-gray-300 dark:border-white/10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher..."
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Catégorie</label>
          <select
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-[#1A1A1D] border-gray-300 dark:border-white/10"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Toutes catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-3 bg-black text-white dark:bg-white dark:text-black font-medium rounded-lg text-sm transition hover:opacity-90"
        >
          {loading ? "Recherche..." : "Rechercher"}
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Résultats</h2>

        {results.length === 0 && !loading && (
          <p className="text-gray-500">Aucun résultat trouvé.</p>
        )}

        <ul className="space-y-4">
          {results.map((item) => (
            <li key={item.id} className="border border-gray-200 dark:border-white/10 rounded-xl p-4 bg-white dark:bg-[#18181A]">
              {/* ✅ Correction : Utilisation de item.name et création d'un vrai lien produit cliquable */}
              <a href={`/${locale}/product/${item.id}`} className="block group">
                <h3 className="font-semibold text-lg group-hover:underline text-black dark:text-white">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {item.description.slice(0, 100)}...
                  </p>
                )}
                {item.prix_locaplux && (
                  <p className="text-sm font-medium mt-2 text-[#1A3A5F] dark:text-[#D4AF37]">
                    {item.prix_locaplux} €
                  </p>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// En Next.js, tout composant utilisant useSearchParams doit être enveloppé dans un Suspense block
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Chargement...</div>}>
      <SearchContent />
    </Suspense>
  );
}
