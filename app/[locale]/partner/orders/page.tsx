"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PartnerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const statusLabels: Record<string, string> = {
    pending: "En attente",
    confirmed: "Confirmée",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const deliveryLabels: Record<string, string> = {
    pending_delivery: "En livraison",
    delivered: "Livrée",
    cancelled: "Annulée",
  };

  const deliveryColors: Record<string, string> = {
    pending_delivery: "bg-yellow-100 text-yellow-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  useEffect(() => {
    fetch("/api/orders/partner")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">
        Chargement des commandes…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-12 px-4 lg:px-0 space-y-10">

        {/* HEADER */}
        <header>
          <p className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase">
            Locaplux • Commandes
          </p>

          <h1 className="mt-2 text-3xl lg:text-4xl font-semibold text-gray-900">
            Commandes reçues
          </h1>

          <p className="mt-3 text-sm text-gray-600 max-w-2xl">
            Suivez l’ensemble des commandes passées sur vos produits.  
            Une vue claire, moderne et intuitive pour gérer votre activité.
          </p>
        </header>

        {/* LISTE DES COMMANDES */}
        <section className="space-y-6">
          {orders.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              Aucune commande reçue pour le moment.
            </div>
          )}

          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/partner/orders/${order.id}`}
              className="block bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
            >
              {/* HEADER COMMANDE */}
              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    Commande #{order.id}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Reçue le{" "}
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </p>

                  {/* Adresse client */}
                  <p className="text-gray-500 text-sm mt-1">
                    {order.street} {order.number}, {order.postal} {order.city}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {/* Statut commande */}
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                  >
                    {statusLabels[order.status]}
                  </span>

                  {/* Statut livraison */}
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${deliveryColors[order.deliveryStatus]}`}
                  >
                    {deliveryLabels[order.deliveryStatus] || "En livraison"}
                  </span>
                </div>
              </div>

              {/* ITEMS */}
              <div className="space-y-2 text-gray-700">
                {order.items.slice(0, 2).map((item: any) => (
                  <p key={item.id}>
                    {item.product.name} × {item.quantity}
                  </p>
                ))}

                {order.items.length > 2 && (
                  <p className="text-gray-500 text-sm">
                    + {order.items.length - 2} autre(s) article(s)
                  </p>
                )}
              </div>

              <hr className="my-4" />

              {/* TOTAL + LIVRAISON */}
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-900">
                  Total : {order.total} €
                </p>

                <p className="text-sm text-gray-600">
                  Livraison : {order.deliveryPrice} € • {order.deliveryDistance} km
                </p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
