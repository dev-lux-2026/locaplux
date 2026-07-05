"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();

        if (res.ok) {
          setOrder(data);
        }
      } catch (e) {
        console.error("Erreur chargement commande", e);
      }

      setLoading(false);
    }

    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-600">
        Chargement de la commande...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-semibold mb-2">Commande introuvable</h1>
        <p className="text-gray-600 mb-6">
          Si vous avez payé, contactez le support Locaplux.
        </p>

        <Link
          href="/account/orders"
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition"
        >
          Voir mes commandes
        </Link>
      </div>
    );
  }

  const statusLabels: any = {
    pending: "En attente",
    confirmed: "Confirmée",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1A3A5F] mb-2">
          Commande #{order.id}
        </h1>

        <p className="text-gray-600">
          Passée le{" "}
          {new Date(order.createdAt).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>

        <span
          className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-medium ${
            order.status === "confirmed"
              ? "bg-green-100 text-green-700"
              : order.status === "shipped"
              ? "bg-blue-100 text-blue-700"
              : order.status === "delivered"
              ? "bg-purple-100 text-purple-700"
              : order.status === "cancelled"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {statusLabels[order.status]}
        </span>
      </div>

      {/* PRODUITS */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Produits commandés
        </h2>

        <div className="space-y-4">
          {order.items.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b border-gray-100 pb-4"
            >
              <img
                src={item.product.images?.[0]}
                alt={item.product.name}
                className="w-20 h-20 rounded-lg object-cover bg-gray-100"
              />

              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {item.product.name}
                </p>
                <p className="text-sm text-gray-500">
                  Quantité : {item.quantity}
                </p>
              </div>

              <p className="font-semibold text-gray-900">
                {item.price * item.quantity} €
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6 text-lg font-semibold">
          <span>Total</span>
          <span>{order.total} €</span>
        </div>
      </div>

      {/* ADRESSE DE LIVRAISON */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Adresse de livraison
        </h2>

        <p className="text-gray-800 font-medium">
          {order.street} {order.number}
        </p>
        <p className="text-gray-700">
          {order.postal} {order.city}
        </p>
        <p className="text-gray-700">{order.country}</p>
      </div>

      {/* VENDEUR */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Vendeur
        </h2>

        <p className="text-gray-800 font-medium">{order.partner.publicName}</p>
        <p className="text-gray-600 text-sm">{order.partner.email}</p>

        <Link
          href={`/partner/messages/${order.partnerId}`}
          className="inline-block mt-4 px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
        >
          Contacter le vendeur
        </Link>
      </div>

      {/* RETOUR */}
      <div className="text-center">
        <Link
          href="/account/orders"
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Retour à mes commandes
        </Link>
      </div>
    </div>
  );
}
