"use client";

import { useEffect, useState } from "react";

export default function PartnerAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partner/analytics")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#0B0B0C]">
        Chargement des statistiques…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0C]">
      <div className="max-w-6xl mx-auto py-12 px-4 lg:px-0 space-y-12">

        {/* HEADER */}
        <header>
          <p className="text-xs font-medium tracking-[0.2em] text-gray-500 dark:text-gray-400 uppercase">
            Locaplux • Statistiques
          </p>

          <h1 className="mt-2 text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white">
            Statistiques & Analytics
          </h1>

          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            Suivez les performances de vos produits, vos ventes et l’activité des clients.
          </p>
        </header>

        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Vues produits", value: stats.views },
            { label: "Favoris", value: stats.favorites },
            { label: "Commandes", value: stats.orders },
            { label: "Revenus (€)", value: stats.revenue },
          ].map((kpi, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">{kpi.label}</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {kpi.value}
              </p>
            </div>
          ))}
        </section>

        {/* GRAPH PLACEHOLDER */}
        <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Ventes des 30 derniers jours
          </h2>

          <div className="h-64 bg-gray-100 dark:bg-[#1A1A1C] rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400">
            Graphique à intégrer
          </div>
        </section>

        {/* TOP PRODUITS */}
        <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Produits les plus performants
          </h2>

          <div className="space-y-4">
            {stats.topProducts.map((p: any) => (
              <div
                key={p.id}
                className="flex justify-between items-center border-b border-gray-200 dark:border-white/10 pb-4"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{p.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {p.views} vues • {p.orders} commandes • {p.favorites} favoris
                  </p>
                </div>

                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {p.revenue} €
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
