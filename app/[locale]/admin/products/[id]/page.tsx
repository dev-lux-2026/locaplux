"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Toast from "../../components/Toast";

function getPartnerDisplayName(partner: any): string {
  if (!partner) return "—";
  const fullName = [partner.firstName, partner.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  return (
    partner.publicName ||
    partner.company ||
    partner.name ||
    fullName ||
    "—"
  );
}

export default function AdminProductDetail() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [savingCategory, setSavingCategory] = useState(false);

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [toast, setToast] = useState<
    null | { message: string; type: "success" | "error" }
  >(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const [pRes, cRes] = await Promise.all([
        fetch(`/api/admin/products/${id}`),
        fetch(`/api/categories`),
      ]);

      const p = await pRes.json();
      setProduct(p);
      setSelectedCategoryId(
        p?.categoryId ? String(p.categoryId) : p?.category?.id ? String(p.category.id) : ""
      );

      if (cRes.ok) {
        const cData = await cRes.json();
        const list = Array.isArray(cData) ? cData : cData?.categories ?? [];
        setCategories(Array.isArray(list) ? list : []);
      }

      setLoading(false);
    }

    async function loadLogs() {
      const l = await fetch(`/api/admin/products/${id}/logs`).then((r) =>
        r.json()
      );
      setLogs(Array.isArray(l) ? l : []);
      setLogsLoading(false);
    }

    load();
    loadLogs();
  }, [id]);

  async function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;

    setSavingCategory(true);

    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: selectedCategoryId || null,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setProduct((prev: any) => ({
        ...prev,
        ...data,
      }));
      setToast({ message: "Catégorie mise à jour", type: "success" });
    } else {
      setToast({
        message: data?.error || "Erreur lors de la mise à jour de la catégorie",
        type: "error",
      });
    }

    setSavingCategory(false);
  }

  async function updateStatus(newStatus: string) {
    setProcessing(true);

    const res = await fetch(`/api/admin/products/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: newStatus,
        adminId: "system",
      }),
    });

    if (res.ok) {
      setToast({ message: "Statut mis à jour", type: "success" });
      setProduct((prev: any) => ({ ...prev, status: newStatus }));

      const l = await fetch(`/api/admin/products/${id}/logs`).then((r) =>
        r.json()
      );
      setLogs(Array.isArray(l) ? l : []);
    } else {
      setToast({ message: "Erreur lors de la mise à jour", type: "error" });
    }

    setProcessing(false);
  }

  if (loading) return <p>Chargement...</p>;
  if (!product) return <p>Produit introuvable.</p>;

  const statusColors: any = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-gray-100 text-gray-700",
    rejected: "bg-red-200 text-red-800",
    disabled: "bg-yellow-100 text-yellow-700",
  };

  const price = product.prix_locaplux ?? product.prix_normal ?? product.price;
  const partnerName = getPartnerDisplayName(product.partner);

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Link href="/admin/products" className="text-blue-600 hover:underline">
        ← Retour
      </Link>

      <h1 className="text-2xl font-bold">Produit #{product.id}</h1>

      {/* Infos produit */}
      <div className="bg-white p-6 shadow rounded space-y-4">
        <h2 className="text-xl font-semibold">Informations</h2>

        <p>
          <span className="font-semibold">Nom :</span> {product.name}
        </p>

        <p>
          <span className="font-semibold">Description :</span>{" "}
          {product.description || "—"}
        </p>

        <p>
          <span className="font-semibold">Prix :</span>{" "}
          {price !== null && price !== undefined && price !== ""
            ? `${price} €`
            : "—"}
          {product.prix_normal ? (
            <span className="ml-2 text-sm text-gray-500">
              (Prix normal : {product.prix_normal} €)
            </span>
          ) : null}
        </p>

        <p>
          <span className="font-semibold">Stock :</span> {product.stock}
        </p>

        <p>
          <span className="font-semibold">Catégorie :</span>{" "}
          {product.category?.name || "—"}
        </p>

        <p>
          <span className="font-semibold">Partenaire :</span> {partnerName} (
          {product.partner?.email || "—"})
        </p>

        <p>
          <span className="font-semibold">Statut :</span>{" "}
          <span
            className={`px-3 py-1 rounded text-sm ${statusColors[product.status]}`}
          >
            {product.status}
          </span>
        </p>
      </div>

      {/* Modifier la catégorie */}
      <div className="bg-white p-6 shadow rounded space-y-4">
        <h2 className="text-xl font-semibold">Catégorie</h2>

        <form
          onSubmit={handleSaveCategory}
          className="flex flex-wrap items-center gap-3"
        >
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="px-3 py-2 border rounded bg-white text-gray-900 min-w-[240px]"
          >
            <option value="">— Sans catégorie —</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={savingCategory}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {savingCategory ? "Enregistrement..." : "Enregistrer la catégorie"}
          </button>
        </form>
      </div>

      {/* Images */}
      <div className="bg-white p-6 shadow rounded space-y-4">
        <h2 className="text-xl font-semibold">Images</h2>

        {product.images?.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {product.images.map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                alt={`Image ${i + 1}`}
                className="w-full h-40 object-cover rounded"
              />
            ))}
          </div>
        ) : (
          <p>Aucune image.</p>
        )}
      </div>

      {/* Actions admin */}
      <div className="bg-white p-6 shadow rounded space-x-3">
        <h2 className="text-xl font-semibold mb-4">Actions admin</h2>

        {product.status !== "approved" && (
          <button
            disabled={processing}
            onClick={() => updateStatus("approved")}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Approuver
          </button>
        )}

        {product.status !== "rejected" && (
          <button
            disabled={processing}
            onClick={() => updateStatus("rejected")}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Rejeter
          </button>
        )}

        {product.status !== "disabled" && (
          <button
            disabled={processing}
            onClick={() => updateStatus("disabled")}
            className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Désactiver
          </button>
        )}
      </div>

      {/* Historique des actions admin */}
      <div className="bg-white p-6 shadow rounded space-y-4">
        <h2 className="text-xl font-semibold">Historique des actions admin</h2>

        {logsLoading ? (
          <p>Chargement de l&apos;historique...</p>
        ) : logs.length === 0 ? (
          <p>Aucune action enregistrée pour ce produit.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log) => (
              <li key={log.id} className="text-sm border-b pb-2">
                <div className="flex justify-between">
                  <span className="font-medium">{log.action}</span>
                  <span className="text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                {log.comment && (
                  <p className="text-gray-700 mt-1">{log.comment}</p>
                )}
                <p className="text-gray-500 mt-1">
                  Admin : {log.adminId || "system"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}