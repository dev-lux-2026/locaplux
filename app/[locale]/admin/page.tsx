"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentPartners, setRecentPartners] = useState([]);
  const [recentBoosts, setRecentBoosts] = useState([]);

  useEffect(() => {
    fetch("/api/admin/stats").then(r => r.json()).then(setStats);
    fetch("/api/admin/recent-orders").then(r => r.json()).then(setRecentOrders);
    fetch("/api/admin/recent-partners").then(r => r.json()).then(setRecentPartners);
    fetch("/api/admin/recent-boosts").then(r => r.json()).then(setRecentBoosts);
  }, []);

  if (!stats) return <p>Chargement...</p>;

  return (
    <div className="max-w-7xl mx-auto py-10 space-y-12">

      {/* TITRE */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-gray-600 mt-2">Vue d’ensemble de la marketplace Locaplux</p>
      </div>

      {/* KPIs */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Statistiques globales</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KpiCard label="Produits" value={stats.products} />
          <KpiCard label="Partenaires" value={stats.partners} />
          <KpiCard label="Utilisateurs" value={stats.users} />
          <KpiCard label="Commandes" value={stats.orders} />
        </div>
      </section>

      {/* REVENUS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Revenus</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <KpiCard label="Revenu brut" value={stats.grossRevenue.toFixed(2) + " €"} />
          <KpiCard
            label={`Revenu Locaplux (${Math.round(stats.commissionRate * 100)}%)`}
            value={stats.commissionTotal.toFixed(2) + " €"}
          />
        </div>
      </section>

      {/* PARAMÈTRES MARKETPLACE */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Paramètres marketplace</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <KpiCard label="Articles gratuits" value={stats.freeProductsLimit} />
          <KpiCard label="Durée gratuite" value={stats.freeDaysLimit + " jours"} />
        </div>
      </section>

      {/* COMMANDES RÉCENTES */}
      <SectionList
        title="Commandes récentes"
        items={recentOrders}
        render={(o) => (
          <li className="border-b py-2">
            <strong>{o.total} €</strong> — {o.partner?.name ?? "Partenaire"} — {o.status}
          </li>
        )}
      />

      {/* PARTENAIRES RÉCENTS */}
      <SectionList
        title="Partenaires récents"
        items={recentPartners}
        render={(p) => (
          <li className="border-b py-2">
            <strong>{p.name}</strong> — {p.email} — {p._count.products} produits
          </li>
        )}
      />

      {/* BOOSTS RÉCENTS */}
      <SectionList
        title="Boosts récents"
        items={recentBoosts}
        render={(b) => (
          <li className="border-b py-2">
            <strong>{b.product?.title}</strong> — {b.type} — {b.price} €
          </li>
        )}
      />

    </div>
  );
}

function KpiCard({ label, value }) {
  return (
    <div className="p-6 bg-white shadow rounded-lg text-center">
      <p className="text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function SectionList({ title, items, render }) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ul className="bg-white shadow rounded-lg p-6 space-y-2">
        {items.length === 0 && (
          <p className="text-gray-500">Aucun élément pour le moment.</p>
        )}

        {items.map((item, index) => (
          <li key={item.id ?? item._id ?? item.email ?? index} className="border-b py-2">
            {render(item)}
          </li>
        ))}
      </ul>
    </section>
  );
}
