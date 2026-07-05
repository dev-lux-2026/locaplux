"use client";

import { useState } from "react";

export default function AcceptPartnerTermsPage() {
  const [loading, setLoading] = useState(false);

  async function accept() {
    setLoading(true);
    await fetch("/api/user/accept-partner-terms", { method: "POST" });
    window.location.href = "/account";
  }

  return (
    <div className="max-w-lg mx-auto py-16 px-4">
      <h1 className="text-3xl font-semibold mb-4">Conditions Partenaires</h1>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Pour continuer à utiliser votre compte partenaire, vous devez accepter les Conditions Générales de Vente Partenaires.
      </p>

      <a href="/legal/cgv" className="underline block mb-6">Lire les CGV Partenaires</a>

      <button
        onClick={accept}
        disabled={loading}
        className="px-4 py-3 bg-black text-white rounded"
      >
        {loading ? "Validation..." : "J’accepte"}
      </button>
    </div>
  );
}
