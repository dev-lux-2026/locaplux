"use client";

import { useEffect, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  // 🔥 Correction strict TS ici
  function openModal(id: string, type: string) {
    setSelectedId(id);
    setActionType(type);
    setModalOpen(true);
  }

  async function confirmAction() {
    if (!selectedId || !actionType) return;

    await fetch(`/api/admin/orders/${selectedId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: actionType }),
    });

    setModalOpen(false);
    location.reload();
  }

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Commandes</h1>

      <ConfirmModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAction}
        title="Confirmer l'action"
        message={`Voulez-vous vraiment appliquer l'action : ${actionType}?`}
      />

      <table className="w-full bg-white shadow rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Client</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-left">Statut</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t">
              <td className="p-3">{o.id}</td>
              <td className="p-3">{o.user?.name}</td>
              <td className="p-3">{o.total} €</td>
              <td className="p-3">{o.status}</td>
              <td className="p-3 space-x-3">
                <a
                  href={`/admin/orders/${o.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Voir
                </a>

                <button
                  onClick={() => openModal(o.id, "processing")}
                  className="text-yellow-600 hover:underline"
                >
                  En traitement
                </button>

                <button
                  onClick={() => openModal(o.id, "shipped")}
                  className="text-blue-600 hover:underline"
                >
                  Expédiée
                </button>

                <button
                  onClick={() => openModal(o.id, "delivered")}
                  className="text-green-600 hover:underline"
                >
                  Livrée
                </button>

                <button
                  onClick={() => openModal(o.id, "cancelled")}
                  className="text-red-600 hover:underline"
                >
                  Annulée
                </button>

                <button
                  onClick={() => openModal(o.id, "refunded")}
                  className="text-gray-600 hover:underline"
                >
                  Remboursée
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
