"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PendingProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products/pending");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function validate(productId) {
    const res = await fetch("/api/admin/products/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, action: "approve" }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Erreur");
      return;
    }

    toast.success("Produit validé !");
    load();
  }

  async function reject(productId) {
    const reason = prompt("Raison du refus :");

    if (!reason) {
      toast.error("Veuillez indiquer une raison");
      return;
    }

    const res = await fetch("/api/admin/products/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, action: "reject", reason }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Erreur");
      return;
    }

    toast.success("Produit refusé");
    load();
  }

  if (loading) return <p className="p-6">Chargement...</p>;

  if (products.length === 0)
    return <p className="p-6">Aucun produit en attente.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Produits en attente</h1>

      <div className="space-y-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-sm text-gray-600">
                Partenaire : {p.partner?.name || "Inconnu"}
              </p>
              <p className="text-sm text-gray-600">
                Prix : {p.price} €
              </p>
              <p className="text-sm text-gray-600">
                Catégorie : {p.categoryName}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => validate(p.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Valider
              </button>

              <button
                onClick={() => reject(p.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Refuser
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
