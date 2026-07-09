"use client";

import { useEffect, useState } from "react";

interface ProductHistoryEntry {
  id: string;
  action: string;
  reason?: string;
  createdAt: string;
  product?: {
    id: string;
    name: string;
  };
}

export default function ProductHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<ProductHistoryEntry[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/products/history");
      const data = await res.json();

      // Toujours un tableau typé
      setHistory(Array.isArray(data) ? data : []);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Historique des validations</h1>

      <div className="space-y-4">
        {history.length === 0 && (
          <p>Aucun historique disponible.</p>
        )}

        {history.map((h) => (
          <div
            key={h.id}
            className="border p-4 rounded-lg bg-white shadow-sm"
          >
            <p>
              <strong>Produit :</strong>{" "}
              {h.product?.name ?? "Produit supprimé"}
            </p>

            <p>
              <strong>Action :</strong> {h.action}
            </p>

            {h.reason && (
              <p>
                <strong>Raison :</strong> {h.reason}
              </p>
            )}

            <p className="text-sm text-gray-500">
              {new Date(h.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
