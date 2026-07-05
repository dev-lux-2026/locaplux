"use client";

import { useEffect, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                               MINI LINE CHART                               */
/* -------------------------------------------------------------------------- */

function LineChart({ data }: { data: { date: string; value: number }[] }) {
  if (!data || data.length === 0) return null;

  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((d.value - min) / (max - min || 1)) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" className="w-full h-32">
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
/*                               BAR CHART                                     */
/* -------------------------------------------------------------------------- */

function BarChart({ data }: { data: { date: string; count: number }[] }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.count));

  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((d, i) => (
        <div
          key={i}
          className="bg-gray-900 rounded-sm"
          style={{
            height: `${(d.count / max) * 100}%`,
            width: `${100 / data.length}%`,
          }}
        ></div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               DONUT CHART                                   */
/* -------------------------------------------------------------------------- */

function DonutChart({ data }: { data: { label: string; value: number }[] }) {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;

  return (
    <svg viewBox="0 0 42 42" className="w-32 h-32">
      {data.map((d, i) => {
        const start = (cumulative / total) * 100;
        const end = ((cumulative + d.value) / total) * 100;
        cumulative += d.value;

        return (
          <circle
            key={i}
            r="15.915"
            cx="21"
            cy="21"
            fill="transparent"
            strokeWidth="6"
            strokeDasharray={`${end - start} ${100 - (end - start)}`}
            strokeDashoffset={-start}
            stroke={["#1f2937", "#4b5563", "#6b7280", "#9ca3af", "#d1d5db"][i % 5]}
          />
        );
      })}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                               KPI CARD                                      */
/* -------------------------------------------------------------------------- */

function Kpi({ label, value }: { label: string; value: any }) {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-3xl font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN PAGE                                     */
/* -------------------------------------------------------------------------- */

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState("30d");
  const [inactive, setInactive] = useState(45);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/admin/analytics?range=${range}&inactive=${inactive}`)
      .then((res) => res.json())
      .then((d) => setData(d));
  }, [range, inactive]);

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Chargement des analyses…
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">

      {/* HEADER */}
      <header>
        <p className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase">
          Locaplux • Administration
        </p>

        <h1 className="mt-2 text-4xl font-semibold text-gray-900">
          Analytics avancés
        </h1>

        <p className="mt-3 text-sm text-gray-600 max-w-2xl">
          Vue détaillée des performances globales de la marketplace.
        </p>
      </header>

      {/* FILTERS */}
      <div className="flex gap-3">
        {["24h", "7d", "30d", "6m", "12m"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-2 rounded-full border ${
              range === r
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* KPIS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Kpi label="Revenus" value={`${data.kpis.revenue} €`} />
        <Kpi label="Commandes" value={data.kpis.orders} />
        <Kpi label="Panier moyen" value={`${data.kpis.avgOrder} €`} />
        <Kpi label="Croissance" value={`${data.kpis.growth}%`} />
        <Kpi label="Partenaires actifs" value={data.kpis.activePartners} />
        <Kpi label="Partenaires inactifs" value={data.kpis.inactivePartners} />
      </section>

      {/* SALES CHART */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Ventes par jour
        </h2>
        <LineChart data={data.salesPerDay} />
      </section>

      {/* ORDERS CHART */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Commandes par jour
        </h2>
        <BarChart data={data.ordersPerDay} />
      </section>

      {/* SALES BY CATEGORY */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Répartition des ventes par catégorie
        </h2>

        <div className="flex items-center gap-6">
          <DonutChart
            data={data.salesByCategory.map((c: any) => ({
              label: c.category,
              value: c.value,
            }))}
          />

          <div className="space-y-2">
            {data.salesByCategory.map((c: any, i: number) => (
              <p key={i} className="text-sm text-gray-700">
                <span className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{
                    backgroundColor: ["#1f2937", "#4b5563", "#6b7280", "#9ca3af", "#d1d5db"][i % 5],
                  }}
                ></span>
                {c.category} — {c.value} €
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* SALES BY PARTNER */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Répartition des ventes par partenaire
        </h2>

        <div className="flex items-center gap-6">
          <DonutChart
            data={data.salesByPartner.map((p: any) => ({
              label: p.partner,
              value: p.value,
            }))}
          />

          <div className="space-y-2">
            {data.salesByPartner.map((p: any, i: number) => (
              <p key={i} className="text-sm text-gray-700">
                <span className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{
                    backgroundColor: ["#1f2937", "#4b5563", "#6b7280", "#9ca3af", "#d1d5db"][i % 5],
                  }}
                ></span>
                {p.partner} — {p.value} €
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS BY SECTOR */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Répartition des partenaires par secteur d’activité
        </h2>

        <div className="flex items-center gap-6">
          <DonutChart
            data={data.partnersBySector.map((s: any) => ({
              label: s.sector,
              value: s.count,
            }))}
          />

          <div className="space-y-2">
            {data.partnersBySector.map((s: any, i: number) => (
              <p key={i} className="text-sm text-gray-700">
                <span className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{
                    backgroundColor: ["#1f2937", "#4b5563", "#6b7280", "#9ca3af", "#d1d5db"][i % 5],
                  }}
                ></span>
                {s.sector} — {s.count} partenaires
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* TOP PARTNERS */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Top partenaires
        </h2>

        <div className="space-y-3">
          {data.topPartners.map((p: any) => (
            <div
              key={p.id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
            >
              <div>
                <p className="font-medium text-gray-900">{p.name}</p>
                <p className="text-gray-500 text-sm">
                  {p.orders} commandes • {p.revenue} €
                </p>
              </div>

              {p.rank <= 3 && (
                <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                  Top performer
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* TOP CATEGORIES */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Top catégories
        </h2>

        <div className="space-y-3">
          {data.topCategories.map((c: any, i: number) => (
            <div
              key={i}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
            >
              <p className="font-medium text-gray-900">{c.category}</p>
              <p className="text-gray-500 text-sm">
                {c.revenue} € • {c.percentage}%
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT ACTIVITY */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Activité récente
        </h2>

        <div className="space-y-4">
          {data.recentOrders.map((o: any) => (
            <div
              key={o.id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
            >
              <div>
                <p className="font-medium text-gray-900">
                  Commande #{o.id}
                </p>
                <p className="text-gray-500 text-sm">
                  {o.partner} •{" "}
                  {new Date(o.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>

              <p className="font-semibold text-gray-900">{o.total} €</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
