"use client";

import { useEffect, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

interface Order {
  id: string;
  total: number;
  status: string;
  user?: {
    email?: string;
  };
  userId?: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders/list")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  function openModal(id: string, type: string) {
    setSelectedId(id);
    setActionType(type);
    setModalOpen(true);
  }

  async function confirmAction() {
    if (!selectedId || !actionType) return;

    const statusMap: Record<string, string> = {
      ship: "shipped",
      cancel: "cancelled",
    };

    const res = await fetch(`/api/admin/orders/${selectedId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: statusMap[actionType] }),
    });

    if (res.ok) {
      setToast({ message: "Action effectuée", type: "success" });
    } else {
      setToast({ message: "Erreur lors de l’action", type: "error" });
    }

    setModalOpen(false);
    setTimeout(() => location.reload(), 1200);
  }

  if (loading) return <p>Chargement...</p>;
  if (orders.length === 0) return <p>Aucune commande trouvée.</p>;

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-blue-100 text-blue-700",
    processing: "bg-purple-100 text-purple-700",
    shipped: "bg-green-100 text-green-700",
    delivered: "bg-green-200 text-green-800",
    cancelled: "bg-red-100 text-red-700",
    refunded: "bg-gray-200 text-gray-700",
  };

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-2xl font-bold mb-6">Commandes</h1>

      <ConfirmModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAction}
        title="Confirmation"
        message="Confirmer cette action ?"
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
              <td className="p-3">{o.user?.email || o.userId}</td>
              <td className="p-3">{o.total} €</td>

              <td className="p-3">
                <span className={`px-3 py-1 rounded text-sm ${statusColors[o.status]}`}>
                  {o.status}
                </span>
              </td>

              <td className="p-3 space-x-3">
                <a href={`/admin/orders/${o.id}`} className="text-blue-600 hover:underline">
                  Voir
                </a>

                <button
                  onClick={() => openModal(o.id, "ship")}
                  className="text-green-600 hover:underline"
                >
                  Expédier
                </button>

                <button
                  onClick={() => openModal(o.id, "cancel")}
                  className="text-red-600 hover:underline"
                >
                  Annuler
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
