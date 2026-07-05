"use client";

import { useEffect, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                               MINI LINE CHART                               */
/* -------------------------------------------------------------------------- */

function MiniLineChart({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / (max - min || 1)) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" className="w-full h-24">
      <polyline
        fill="none"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                               KPI COMPONENT                                 */
/* -------------------------------------------------------------------------- */

function KpiCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: any;
  trend?: number;
}) {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-3xl font-semibold text-gray-900 mt-1">{value}</p>

      {trend !== undefined && (
        <p
          className={`text-sm mt-2 ${
            trend >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend >= 0 ? "+" : ""}
          {trend}% sur 30 jours
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN DASHBOARD                                */
/* -------------------------------------------------------------------------- */

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Chargement du tableau de bord…
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">

      {/* HEADER */}
      <header>
        <p className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase">
          Locaplux • Administration
        </p>

        <h1 className="mt-2 text-4xl font-semibold text-gray-900">
          Dashboard global
        </h1>

        <p className="mt-3 text-sm text-gray-600 max-w-2xl">
          Vue d’ensemble de la marketplace : partenaires, produits, commandes, revenus et activité.
        </p>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <KpiCard label="Produits" value={stats.products} />
        <KpiCard label="Partenaires" value={stats.partners} />
        <KpiCard label="Utilisateurs" value={stats.users} />
        <KpiCard label="Commandes" value={stats.orders} />
        <KpiCard label="Revenu total" value={`${stats.revenue} €`} />
      </section>

      {/* GRAPH — VENTES 30 JOURS */}
      {stats.salesLast30Days && (
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Ventes globales — 30 derniers jours
          </h2>

          <MiniLineChart data={stats.salesLast30Days} />
        </section>
      )}

      {/* DERNIÈRES COMMANDES */}
      {stats.recentOrders && (
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Dernières commandes
          </h2>

          <div className="space-y-3">
            {stats.recentOrders.map((order: any) => (
              <div
                key={order.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    Commande #{order.id}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {order.partnerName} •{" "}
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <p className="font-semibold text-gray-900">{order.total} €</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* NOUVEAUX PARTENAIRES */}
      {stats.newPartners && (
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Nouveaux partenaires
          </h2>

          <div className="space-y-3">
            {stats.newPartners.map((p: any) => (
              <div
                key={p.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-gray-900">{p.publicName}</p>
                  <p className="text-gray-500 text-sm">
                    Inscrit le{" "}
                    {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
