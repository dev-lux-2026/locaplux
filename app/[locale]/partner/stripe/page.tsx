"use client";

import { useState } from "react";

export default function StripeActivationPage() {
  const [loading, setLoading] = useState(false);

  async function startOnboarding() {
    setLoading(true);

    const res = await fetch("/api/stripe/connect", {
      method: "POST",
    });

    const data = await res.json();
    setLoading(false);

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erreur Stripe");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto py-12 px-4 lg:px-0 space-y-10">

        {/* HEADER */}
        <header>
          <p className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase">
            Locaplux • Paiements
          </p>

          <h1 className="mt-2 text-3xl lg:text-4xl font-semibold text-gray-900">
            Activer mon compte Stripe
          </h1>

          <p className="mt-3 text-sm text-gray-600 max-w-lg">
            Pour recevoir vos paiements, vous devez connecter votre compte Stripe.
            Cette étape est obligatoire pour vendre sur Locaplux.
          </p>
        </header>

        {/* CARD */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Pourquoi Stripe ?
          </h2>

          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Paiements sécurisés et conformes aux normes européennes</li>
            <li>• Virements automatiques sur votre compte bancaire</li>
            <li>• Gestion simplifiée des factures et des taxes</li>
            <li>• Protection contre la fraude</li>
          </ul>

          <button
            onClick={startOnboarding}
            disabled={loading}
            className="mt-4 px-6 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? "Redirection…" : "Activer mon compte Stripe"}
          </button>
        </section>

        {/* INFO */}
        <section className="text-sm text-gray-500">
          Une fois votre compte Stripe configuré, vous serez automatiquement redirigé
          vers Locaplux pour finaliser l’activation.
        </section>
      </div>
    </div>
  );
}
