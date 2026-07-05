"use client";

import { useEffect, useState } from "react";

export default function PartnerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/partner/dashboard");
        if (!res.ok) throw new Error("Erreur API");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Erreur dashboard partenaire:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-white">
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10 text-red-500">
        Impossible de charger les données.
      </div>
    );
  }

  const { stats, recentOrders, recentProducts, analytics } = data;

  return (
    <div className="p-10 text-white space-y-10">

      {/* STATS */}
      <section>
        <h1 className="text-3xl font-bold mb-4">Tableau de bord partenaire</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-lg font-semibold">Commandes totales</h2>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-lg font-semibold">Revenus totaux</h2>
            <p className="text-3xl font-bold">{stats.totalRevenue} €</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-lg font-semibold">Produits actifs</h2>
            <p className="text-3xl font-bold">{stats.activeProducts}</p>
          </div>
        </div>
      </section>

      {/* COMMANDES RÉCENTES */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Commandes récentes</h2>
        <div className="bg-gray-900 p-6 rounded-xl space-y-4">
          {recentOrders.length === 0 && (
            <p className="text-gray-400">Aucune commande récente.</p>
          )}

          {recentOrders.map((order: any) => (
            <div key={order.id} className="border-b border-gray-700 pb-3">
              <p className="font-semibold">Commande #{order.id}</p>
              <p>Total : {order.total} €</p>
              <p>Date : {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUITS RÉCENTS */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Produits ajoutés récemment</h2>
        <div className="bg-gray-900 p-6 rounded-xl space-y-4">
          {recentProducts.length === 0 && (
            <p className="text-gray-400">Aucun produit récent.</p>
          )}

          {recentProducts.map((product: any) => (
            <div key={product.id} className="border-b border-gray-700 pb-3">
              <p className="font-semibold">{product.name}</p>
              <p>Prix : {product.price} €</p>
              <p>Stock : {product.stock}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ANALYTICS */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Statistiques</h2>
        <div className="bg-gray-900 p-6 rounded-xl">
          <p>Visites du mois : {analytics.monthlyVisits}</p>
          <p>Conversions : {analytics.conversionRate}%</p>
        </div>
      </section>

    </div>
  );
}
