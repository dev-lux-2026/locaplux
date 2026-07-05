"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        const mapped: any = {};
        data.forEach((s: any) => {
          mapped[s.key] = s.value ? JSON.parse(s.value) : "";
        });
        setSettings(mapped);
        setLoading(false);
      });
  }, []);

  const update = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    await fetch("/api/admin/settings", {
      method: "POST",
      body: JSON.stringify(settings)
    });
    alert("Paramètres mis à jour");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Chargement des paramètres…
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-10">
      <h1 className="text-3xl font-bold">Paramètres Locaplux</h1>

      {/* BUSINESS */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Business</h2>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">Commission (%)</label>
          <input
            type="number"
            className="border p-2 rounded w-full"
            value={settings.commissionRate || ""}
            onChange={(e) => update("commissionRate", Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">Limite produits gratuits</label>
          <input
            type="number"
            className="border p-2 rounded w-full"
            value={settings.freeProductLimit || ""}
            onChange={(e) => update("freeProductLimit", Number(e.target.value))}
          />
        </div>
      </section>

      {/* SYSTEM */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Système</h2>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.maintenanceMode || false}
            onChange={(e) => update("maintenanceMode", e.target.checked)}
          />
          <label>Mode maintenance</label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.enablePartnerSignup || false}
            onChange={(e) => update("enablePartnerSignup", e.target.checked)}
          />
          <label>Activer inscriptions partenaires</label>
        </div>
      </section>

      {/* LEGAL */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Légal</h2>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">URL CGV</label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={settings.cgvUrl || ""}
            onChange={(e) => update("cgvUrl", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">URL Politique de confidentialité</label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={settings.privacyUrl || ""}
            onChange={(e) => update("privacyUrl", e.target.value)}
          />
        </div>
      </section>

      <button
        onClick={save}
        className="px-6 py-3 bg-black text-white rounded-lg shadow"
      >
        Sauvegarder
      </button>
    </div>
  );
}
