"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Toast from "../../[locale]/admin/components/Toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<
    null | { message: string; type: "success" | "error" }
  >(null);

  useEffect(() => {
    fetch("/api/admin/products/list")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const statusColors: any = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-gray-100 text-gray-700",
    rejected: "bg-red-200 text-red-800",
    disabled: "bg-yellow-100 text-yellow-700",
  };

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-2xl font-bold">Produits</h1>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Nom</th>
              <th className="p-3">Partenaire</th>
              <th className="p-3">Catégorie</th>
              <th className="p-3">Prix</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded" />
                  )}
                </td>

                <td className="p-3 font-medium">{product.name}</td>

                <td className="p-3">
                  {product.partner?.name || "—"}
                  <br />
                  <span className="text-sm text-gray-500">
                    {product.partner?.email}
                  </span>
                </td>

                <td className="p-3">{product.category?.name || "—"}</td>

                <td className="p-3">{product.price} €</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${statusColors[product.status]}`}
                  >
                    {product.status}
                  </span>
                </td>

                <td className="p-3 space-x-3">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Voir
                  </Link>

                  {product.status !== "approved" && (
                    <button
                      className="text-green-600 hover:underline"
                      onClick={async () => {
                        await fetch(
                          `/api/admin/products/${product.id}/status`,
                          {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              status: "approved",
                              adminId: "system",
                            }),
                          }
                        );

                        setToast({
                          message: "Produit approuvé",
                          type: "success",
                        });

                        setProducts((prev) =>
                          prev.map((p) =>
                            p.id === product.id
                              ? { ...p, status: "approved" }
                              : p
                          )
                        );
                      }}
                    >
                      Approuver
                    </button>
                  )}

                  {product.status !== "rejected" && (
                    <button
                      className="text-red-600 hover:underline"
                      onClick={async () => {
                        await fetch(
                          `/api/admin/products/${product.id}/status`,
                          {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              status: "rejected",
                              adminId: "system",
                            }),
                          }
                        );

                        setToast({
                          message: "Produit rejeté",
                          type: "success",
                        });

                        setProducts((prev) =>
                          prev.map((p) =>
                            p.id === product.id
                              ? { ...p, status: "rejected" }
                              : p
                          )
                        );
                      }}
                    >
                      Rejeter
                    </button>
                  )}

                  {product.status !== "disabled" && (
                    <button
                      className="text-yellow-600 hover:underline"
                      onClick={async () => {
                        await fetch(
                          `/api/admin/products/${product.id}/status`,
                          {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              status: "disabled",
                              adminId: "system",
                            }),
                          }
                        );

                        setToast({
                          message: "Produit désactivé",
                          type: "success",
                        });

                        setProducts((prev) =>
                          prev.map((p) =>
                            p.id === product.id
                              ? { ...p, status: "disabled" }
                              : p
                          )
                        );
                      }}
                    >
                      Désactiver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
