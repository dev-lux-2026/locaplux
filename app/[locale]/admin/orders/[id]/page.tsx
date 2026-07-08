"use client";

import { useEffect, useState } from "react";

interface AdminOrderDetailProps {
  params: {
    id: string;
  };
}

export default function AdminOrderDetail({ params }: AdminOrderDetailProps) {
  const id = params.id;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Chargement...</div>;

  const updateStatus = async (status: string) => {
    await fetch(`/api/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    alert("Statut mis à jour");
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Commande #{order.id}</h1>

      {/* Infos commande */}
      <div className="space-y-2">
        <p><strong>Statut :</strong> {order.status}</p>
        <p><strong>Total :</strong> {order.total} €</p>
        <p><strong>Date :</strong> {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      {/* Utilisateur */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Client</h2>
        <p>Nom : {order.user?.name}</p>
        <p>Email : {order.user?.email}</p>
      </div>

      {/* Items */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Articles</h2>

        {order.items.map((item: any) => (
          <div key={item.id} className="border p-4 rounded">
            <p><strong>Produit :</strong> {item.product?.name}</p>
            <p><strong>Quantité :</strong> {item.quantity}</p>
            <p><strong>Prix unitaire :</strong> {item.product?.price} €</p>
            <p><strong>Total :</strong> {item.quantity * item.product?.price} €</p>

            <a
              href={`/admin/products/${item.product?.id}`}
              className="text-blue-600 underline"
            >
              Voir le produit
            </a>
          </div>
        ))}
      </div>

      {/* Statut */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Changer le statut</h2>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => updateStatus("processing")}
            className="bg-yellow-600 text-white px-4 py-2 rounded"
          >
            En traitement
          </button>

          <button
            onClick={() => updateStatus("shipped")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Expédiée
          </button>

          <button
            onClick={() => updateStatus("delivered")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Livrée
          </button>

          <button
            onClick={() => updateStatus("cancelled")}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Annulée
          </button>

          <button
            onClick={() => updateStatus("refunded")}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Remboursée
          </button>
        </div>
      </div>
    </div>
  );
}
