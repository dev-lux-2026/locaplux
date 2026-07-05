"use client";

import { useState, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";

export default function PartnerNotificationsPage() {
  const [prefs, setPrefs] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // SSE temps réel
  const notif = useNotifications();

  useEffect(() => {
    fetch("/api/partner/notifications")
      .then((res) => res.json())
      .then((data) => setPrefs(data));
  }, []);

  async function save() {
    setSaving(true);

    const res = await fetch("/api/partner/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prefs),
    });

    setSaving(false);

    if (!res.ok) {
      alert("Erreur lors de la sauvegarde");
    }
  }

  if (!prefs) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Chargement des préférences…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4 lg:px-0 space-y-10">

        {/* HEADER */}
        <header>
          <p className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase">
            Locaplux • Notifications
          </p>

          <h1 className="mt-2 text-3xl lg:text-4xl font-semibold text-gray-900">
            Notifications & alertes
          </h1>

          <p className="mt-3 text-sm text-gray-600 max-w-2xl">
            Gérez comment vous souhaitez être averti des nouvelles commandes,
            messages, paiements et événements importants.
          </p>
        </header>

        {/* SECTION — Aperçu temps réel */}
        {notif && (
          <section className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-blue-900">
              Notification reçue en direct
            </h2>

            <pre className="text-xs text-blue-900 mt-3 bg-white p-3 rounded-xl border border-blue-200 shadow-sm">
              {JSON.stringify(notif, null, 2)}
            </pre>
          </section>
        )}

        {/* SECTION — Commandes */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Commandes</h2>

          <Toggle
            label="Nouvelle commande"
            value={prefs.orders}
            onChange={(v) => setPrefs({ ...prefs, orders: v })}
          />

          <Toggle
            label="Commande expédiée"
            value={prefs.orderShipped}
            onChange={(v) => setPrefs({ ...prefs, orderShipped: v })}
          />

          <Toggle
            label="Commande livrée"
            value={prefs.orderDelivered}
            onChange={(v) => setPrefs({ ...prefs, orderDelivered: v })}
          />
        </section>

        {/* SECTION — Messages */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>

          <Toggle
            label="Nouveau message client"
            value={prefs.messages}
            onChange={(v) => setPrefs({ ...prefs, messages: v })}
          />
        </section>

        {/* SECTION — Paiements */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Paiements</h2>

          <Toggle
            label="Virement reçu"
            value={prefs.payouts}
            onChange={(v) => setPrefs({ ...prefs, payouts: v })}
          />
        </section>

        {/* SECTION — Email */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Email</h2>

          <Toggle
            label="Recevoir un email pour chaque événement important"
            value={prefs.email}
            onChange={(v) => setPrefs({ ...prefs, email: v })}
          />
        </section>

        {/* ACTIONS */}
        <div className="flex justify-end">
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition disabled:opacity-50"
          >
            {saving ? "Enregistrement…" : "Enregistrer les préférences"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               TOGGLE COMPONENT                              */
/* -------------------------------------------------------------------------- */

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-800">{label}</span>

      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full flex items-center transition ${
          value ? "bg-black" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
