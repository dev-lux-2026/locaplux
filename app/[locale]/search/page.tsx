"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

type Category = {
  id: string;
  name: string;
};

export default function SearchPage() {
  const { locale } = useParams();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`/api/categories`);
        const data = await res.json();
        setCategories(data || []);
      } catch (err) {
        console.error("Erreur chargement catégories :", err);
      }
    }

    loadCategories();
  }, []);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `/api/search?query=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`
      );
      const data = await res.json();
      setResults(data || []);
    } catch (err) {
      console.error("Erreur recherche :", err);
    }

    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Recherche</h1>

      <form onSubmit={handleSearch} className="flex flex-col gap-6">
        <div>
          <label className="block mb-1">Mot-clé</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher..."
          />
        </div>

        <div>
          <label className="block mb-1">Catégorie</label>
          <select
            className="w-full border rounded px-3 py-2"
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
          className="px-4 py-3 bg-black text-white rounded text-sm"
        >
          {loading ? "Recherche..." : "Rechercher"}
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Résultats</h2>

        {results.length === 0 && <p className="text-gray-500">Aucun résultat.</p>}

        <ul className="space-y-4">
          {results.map((item) => (
            <li key={item.id} className="border rounded p-4">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
