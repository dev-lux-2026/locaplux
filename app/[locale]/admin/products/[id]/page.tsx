"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Toast from '../../components/Toast';

export default function AdminProductDetail() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [product, setProduct] = useState<any>(null);
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
      const p = await fetch(`/api/admin/products/${id}`).then((r) => r.json());
      setProduct(p);
      setLoading(false);
    }

    async function loadLogs() {
      const l = await fetch(`/api/admin/products/${id}/logs`).then((r) =>
        r.json()
      );
      setLogs(l);
      setLogsLoading(false);
    }

    load();
    loadLogs();
  }, [id]);

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

      // On recharge les logs après action
      const l = await fetch(`/api/admin/products/${id}/logs`).then((r) =>
        r.json()
      );
      setLogs(l);
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
          <span className="font-semibold">Prix :</span> {product.price} €
        </p>

        <p>
          <span className="font-semibold">Stock :</span> {product.stock}
        </p>

        <p>
          <span className="font-semibold">Catégorie :</span>{" "}
          {product.category?.name || "—"}
        </p>

        <p>
          <span className="font-semibold">Partenaire :</span>{" "}
          {product.partner?.name || "—"} ({product.partner?.email || "—"})
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
