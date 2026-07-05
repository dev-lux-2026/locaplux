"use client";

import { useState } from "react";

export default function ExportPage() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/account/export");

      if (!res.ok) {
        alert("Erreur lors de l’export.");
        setLoading(false);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "locaplux-export.json";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
        Export de vos données
      </h1>

      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Conformément au RGPD, vous pouvez télécharger l’ensemble des données
        associées à votre compte Locaplux : profil, commandes, messages,
        questions, wishlist, adresses…
      </p>

      <button
        onClick={handleExport}
        disabled={loading}
        className="px-6 py-3 rounded-lg bg-black text-white text-sm hover:bg-neutral-800 transition disabled:opacity-50"
      >
        {loading ? "Génération en cours..." : "Télécharger mes données"}
      </button>
    </div>
  );
}
