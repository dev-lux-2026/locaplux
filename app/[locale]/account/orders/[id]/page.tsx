"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ClientOrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const deliveryLabels: Record<string, string> = {
    pending_delivery: "En livraison",
    delivered: "Livrée",
    cancelled: "Annulée",
  };

  const deliveryColors: Record<string, string> = {
    pending_delivery: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    delivered: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Chargement…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Commande introuvable.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0C]">
      <div className="max-w-4xl mx-auto py-12 px-4 lg:px-0 space-y-10">

        {/* HEADER */}
        <header>
          <p className="text-xs font-medium tracking-[0.2em] text-gray-500 dark:text-gray-400 uppercase">
            Locaplux • Commande
          </p>

          <h1 className="mt-2 text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white">
            Commande #{order.id}
          </h1>

          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Passée le {new Date(order.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </header>

        {/* STATUT LIVRAISON */}
        <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Statut de la livraison</h2>

          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${deliveryColors[order.deliveryStatus]}`}
          >
            {deliveryLabels[order.deliveryStatus]}
          </span>

          {/* TIMELINE */}
          <div className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <p>• Commande confirmée</p>
            <p>• Préparation en cours</p>
            <p className={order.deliveryStatus !== "pending_delivery" ? "text-green-500" : ""}>
              • En livraison
            </p>
            <p className={order.deliveryStatus === "delivered" ? "text-green-500" : ""}>
              • Livrée
            </p>
          </div>
        </section>

        {/* LIVRAISON */}
        <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Livraison</h2>

          <p className="text-gray-700 dark:text-gray-300">
            Mode : <strong>{order.deliveryMode}</strong>
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            Distance : <strong>{order.deliveryDistance} km</strong>
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            Prix livraison : <strong>{order.deliveryPrice} €</strong>
          </p>
        </section>

        {/* ADRESSE */}
        <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Adresse de livraison</h2>

          <p className="text-gray-700 dark:text-gray-300">
            {order.street} {order.number}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {order.postal} {order.city}
          </p>
          <p className="text-gray-700 dark:text-gray-300">{order.country}</p>
        </section>

        {/* ARTICLES */}
        <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Articles</h2>

          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="flex justify-between border-b border-gray-100 dark:border-white/10 pb-4"
              >
                <span className="text-gray-800 dark:text-gray-200">
                  {item.product.name} × {item.quantity}
                </span>

                <span className="font-semibold text-gray-900 dark:text-white">
                  {item.price * item.quantity} €
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total</span>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              {order.total} €
            </span>
          </div>
        </section>

        {/* RETOUR */}
        <div className="flex justify-end">
          <button
            onClick={() => router.push("/account/orders")}
            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-[#1A1A1C] transition"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}
