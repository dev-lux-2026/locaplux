"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditProductPage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryName: "",
    images: [],
    autoCategoryIdFromImage: null,
    categoryIdFromText: null,
    categoryResult: null,
  });

  /* ------------------------------------------------------ */
  /* LOAD PRODUCT                                            */
  /* ------------------------------------------------------ */
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();

      setProduct(data);

      setForm({
        name: data.name,
        description: data.description,
        price: data.price,
        categoryName: data.categoryName,
        images: data.images,
        autoCategoryIdFromImage: null,
        categoryIdFromText: null,
        categoryResult: null,
      });

      setLoading(false);
    }
    load();
  }, [id]);

  /* ------------------------------------------------------ */
  /* IA AUTO-CATEGORY (TEXTE + IMAGE)                       */
  /* ------------------------------------------------------ */
  useEffect(() => {
    async function detectCategory() {
      if (!form.name && !form.description) return;

      const res = await fetch("/api/auto-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          autoCategoryIdFromImage: form.autoCategoryIdFromImage,
        }),
      });

      if (!res.ok) return;

      const data = await res.json();

      if (data.categoryId) {
        setForm((prev) => ({
          ...prev,
          categoryIdFromText: data.categoryId,
          categoryResult: {
            categoryId: data.categoryId,
            confidence: data.confidence,
            source: data.source,
            suggestions: data.suggestions?.map((s) => ({
              ...s,
              label: s.category, // 🔥 dynamique
            })),
            label: data.category, // 🔥 dynamique
          },
        }));
      }
    }

    detectCategory();
  }, [form.name, form.description, form.autoCategoryIdFromImage]);

  /* ------------------------------------------------------ */
  /* SUBMIT                                                 */
  /* ------------------------------------------------------ */
  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/partner/products/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: id,
        ...form,
        price: Number(form.price),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Erreur");
      return;
    }

    if (data.requiresAdminReview) {
      toast.success("Modifications envoyées. En attente de validation admin.");
    } else {
      toast.success("Produit mis à jour !");
    }

    router.push("/partner/products");
  }

  if (loading) return <p>Chargement...</p>;

  /* ------------------------------------------------------ */
  /* RENDER                                                 */
  /* ------------------------------------------------------ */
  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Modifier le produit</h1>

      {/* IA CATEGORY RESULT */}
      {form.categoryResult && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            Catégorie détectée :{" "}
            <span className="font-semibold">
              {form.categoryResult.label}
            </span>
          </p>

          {form.categoryResult.suggestions?.length > 0 && (
            <p className="text-xs mt-1 text-green-700 dark:text-green-400">
              Autres possibles :{" "}
              {form.categoryResult.suggestions
                .map((s) => s.label)
                .join(", ")}
            </p>
          )}

          <p className="text-xs mt-1 text-green-600 dark:text-green-400">
            Confiance : {Math.round(form.categoryResult.confidence * 100)}%
            {" • "}
            Source : {form.categoryResult.source}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Nom"
        />

        <textarea
          className="textarea"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
        />

        <input
          className="input"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="Prix"
        />

        <input
          className="input"
          value={form.categoryName}
          onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
          placeholder="Catégorie"
        />

        <button className="btn-primary w-full" type="submit">
          Enregistrer
        </button>
      </form>
    </div>
  );
}
