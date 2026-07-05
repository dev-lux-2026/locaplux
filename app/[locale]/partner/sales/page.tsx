"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PartnerSalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partner/sales")
      .then((res) => res.json())
      .then((data) => {
        setSales(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Chargement des ventes…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-12 px-4 lg:px-0 space-y-10">

        {/* HEADER */}
        <header>
          <p className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase">
            Locaplux • Ventes
          </p>

          <h1 className="mt-2 text-3xl lg:text-4xl font-semibold text-gray-900">
            Mes ventes
          </h1>

          <p className="mt-3 text-sm text-gray-600 max-w-2xl">
            Suivez les performances de vos produits : quantités vendues, revenus générés,
            commandes associées et dernières ventes.
          </p>
        </header>

        {/* TABLEAU DES VENTES */}
        {sales.length === 0 ? (
          <p className="text-gray-600">Aucune vente pour le moment.</p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="text-gray-500 text-sm border-b">
                  <th className="py-3">Produit</th>
                  <th className="py-3">Quantité vendue</th>
                  <th className="py-3">Revenu généré</th>
                  <th className="py-3">Commandes</th>
                  <th className="py-3">Dernière vente</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sales.map((item) => (
                  <tr
                    key={item.productId}
                    className="border-b last:border-none hover:bg-gray-50 transition"
                  >
                    {/* Produit */}
                    <td className="py-4">
                      <Link
                        href={`/partner/products/${item.productId}`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {item.productName}
                      </Link>

                      <div className="text-sm text-gray-500">
                        Stock : {item.stock} — Prix : {item.productPrice} €
                      </div>
                    </td>

                    {/* Quantité */}
                    <td className="py-4 font-semibold text-gray-900">
                      {item.totalQuantity}
                    </td>

                    {/* Revenu */}
                    <td className="py-4 font-semibold text-gray-900">
                      {item.totalRevenue} €
                    </td>

                    {/* Nombre de commandes */}
                    <td className="py-4 text-gray-700">{item.ordersCount}</td>

                    {/* Dernière vente */}
                    <td className="py-4 text-gray-700">
                      {item.lastSale
                        ? new Date(item.lastSale).toLocaleDateString("fr-FR")
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="py-4 text-right">
                      <Link
                        href={`/partner/products/${item.productId}`}
                        className="px-3 py-1 bg-black text-white rounded-lg text-sm hover:bg-gray-900 transition"
                      >
                        Voir produit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
