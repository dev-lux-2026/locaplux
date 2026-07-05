"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Toast from '../components/Toast';
import { usePartnerMode } from "@/lib/context/PartnerModeContext";
import { useParams } from "next/navigation";

/* ------------------------------------------------------ */
/* Labels dommages Locaplux                               */
/* ------------------------------------------------------ */
const damageLabels: Record<string, string> = {
  no_damage: "Aucun dommage",
  exhibition_damage: "Dommage d’exposition",
  transport_damage: "Dommage transport",
  stock_damage: "Dommage stockage",
  missing_part: "Pièce manquante",
  packaging_damage: "Emballage abîmé",
  other: "Autre dommage",
};

const statusLabels: any = {
  pending: "En attente",
  approved: "En ligne",
  rejected: "Refusé",
  disabled: "Désactivé",
};

const statusStyles: any = {
  pending:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700",
  approved:
    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700",
  rejected:
    "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700",
  disabled:
    "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700",
};

export default function PartnerProducts() {
  const { readOnly } = usePartnerMode();
  const { locale } = useParams();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  /* ------------------------------------------------------ */
  /* LOAD PRODUCTS                                          */
  /* ------------------------------------------------------ */
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/partner/products", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setError("Impossible de charger vos produits.");
          setLoading(false);
          return;
        }

        const text = await res.text();
        if (!text) {
          setError("Réponse vide du serveur.");
          setLoading(false);
          return;
        }

        const data = JSON.parse(text);
        setProducts(data);
      } catch (err) {
        setError("Erreur réseau lors du chargement.");
      }

      setLoading(false);
    }

    loadProducts();
  }, []);

  /* ------------------------------------------------------ */
  /* TOGGLE STATUS                                          */
  /* ------------------------------------------------------ */
  async function toggleStatus(id: string, currentStatus: string) {
    if (readOnly) return;

    setActionLoading(true);

    const newStatus = currentStatus === "disabled" ? "approved" : "disabled";

    const res = await fetch(`/api/partner/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-partner-id": products.find((p) => p.id === id)?.partnerId,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );

      setToast({
        message:
          newStatus === "approved"
            ? "Produit réactivé"
            : "Produit désactivé",
        type: "success",
      });
    } else {
      setToast({
        message: "Erreur lors de la mise à jour du statut",
        type: "error",
      });
    }

    setActionLoading(false);
  }

  /* ------------------------------------------------------ */
  /* DELETE PRODUCT                                         */
  /* ------------------------------------------------------ */
  async function deleteProduct(id: string) {
    if (readOnly) return;

    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

    setActionLoading(true);

    const res = await fetch(`/api/partner/products/${id}`, {
      method: "DELETE",
      headers: {
        "x-partner-id": products.find((p) => p.id === id)?.partnerId,
      },
    });

    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setToast({ message: "Produit supprimé", type: "success" });
    } else {
      setToast({ message: "Erreur lors de la suppression", type: "error" });
    }

    setActionLoading(false);
  }

  /* ------------------------------------------------------ */
  /* UI                                                     */
  /* ------------------------------------------------------ */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Chargement des produits…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 dark:text-gray-300 space-y-4">
        <p className="text-lg font-medium">{error}</p>
        <Link
          href={`/${locale}/partner/products`}
          className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl shadow hover:bg-gray-900 dark:hover:bg-gray-200 transition text-sm font-medium"
        >
          Réessayer
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0C]">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto py-12 px-4 lg:px-0 space-y-10">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-gray-500 dark:text-gray-400 uppercase">
              Locaplux • Produits
            </p>

            <h1 className="mt-2 text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white">
              Mes produits
            </h1>

            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
              Gérez vos produits, leur visibilité et leur disponibilité.
            </p>
          </div>

          <Link
            href={`/${locale}/partner/products/new`}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition shadow-sm ${
              readOnly
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-200"
            }`}
          >
            Nouveau produit
          </Link>
        </header>

        {/* LISTE DES PRODUITS */}
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-600 dark:text-gray-400">
            <p className="text-lg font-medium">Aucun produit pour le moment.</p>
            <p className="text-sm mt-2">
              Commencez en ajoutant votre premier produit.
            </p>

            {!readOnly && (
              <Link
                href={`/${locale}/partner/products/new`}
                className="inline-block mt-6 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl shadow hover:bg-gray-900 dark:hover:bg-gray-200 transition text-sm font-medium"
              >
                Ajouter un produit
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {/* IMAGE */}
                <div className="h-56 bg-gray-100 dark:bg-[#1A1A1C] flex items-center justify-center overflow-hidden">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-sm">
                      Aucune image
                    </span>
                  )}
                </div>

                {/* CONTENU */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {p.name}
                      </p>

                      <p className="inline-block mt-1 px-2 py-1 text-xs rounded-lg 
                        bg-blue-100 text-blue-700 border border-blue-300 
                        dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700">
                        {p.categoryName || "Sans catégorie"}
                      </p>

                      <div className="mt-2">
                        <p className="text-gray-900 dark:text-white font-bold text-lg">
                          {p.prix_locaplux} €
                        </p>

                        {p.prix_normal && (
                          <p className="text-sm text-gray-500 line-through">
                            {p.prix_normal} €
                          </p>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {damageLabels[p.damage_type] || "État inconnu"}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Stock : {p.stock}
                      </p>

                      {p.prix_achat && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Prix d’achat : {p.prix_achat} €
                        </p>
                      )}

                      <div className="flex gap-2 mt-1">
                        {p.pickup_available && (
                          <span className="px-2 py-0.5 text-[11px] rounded-lg bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">
                            Retrait
                          </span>
                        )}

                        {p.delivery_available && (
                          <span className="px-2 py-0.5 text-[11px] rounded-lg bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700">
                            Livraison
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[p.status]}`}
                    >
                      {statusLabels[p.status]}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Créé le {new Date(p.createdAt).toLocaleDateString()}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex gap-6 pt-3 text-sm">
                    <Link
                      href={`/${locale}/partner/products/${p.id}`}
                      className={`${
                        readOnly
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-blue-600 dark:text-blue-300 hover:underline"
                      }`}
                    >
                      Modifier
                    </Link>

                    <button
                      disabled={actionLoading || readOnly}
                      onClick={() => toggleStatus(p.id, p.status)}
                      className={`${
                        readOnly
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-yellow-600 dark:text-yellow-400 hover:underline"
                      }`}
                    >
                      {p.status === "disabled" ? "Réactiver" : "Désactiver"}
                    </button>

                    {!readOnly && (
                      <button
                        disabled={actionLoading}
                        onClick={() => deleteProduct(p.id)}
                        className="text-red-600 dark:text-red-400 hover:underline"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
