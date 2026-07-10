"use client";

import { useEffect, useState } from "react";

export default function PartnerPayouts() {
  const [payouts, setPayouts] = useState<any[] | null>(null);

  useEffect(() => {
    fetch("/api/partner/payouts")
      .then((res) => res.json())
      .then((data) => setPayouts(data));
  }, []);

  if (!payouts) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Chargement des paiements…
      </div>
    );
  }

  const statusLabels: Record<string, string> = {
    paid: "Payé",
    pending: "En attente",
    processing: "En traitement",
  };

  const statusColors: Record<string, string> = {
    paid: "bg-green-100 text-green-700 border-green-300",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    processing: "bg-gray-100 text-gray-700 border-gray-300",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 lg:px-0 space-y-10">

        {/* HEADER */}
        <header>
          <p className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase">
            Locaplux • Paiements
          </p>

          <h1 className="mt-2 text-3xl lg:text-4xl font-semibold text-gray-900">
            Paiements reçus
          </h1>

          <p className="mt-3 text-sm text-gray-600 max-w-2xl">
            Consultez l’historique complet de vos virements bancaires effectués via Locaplux.
          </p>
        </header>

        {/* TIMELINE */}
        <section className="space-y-8">
          {payouts.length === 0 && (
            <div className="text-gray-600 text-center py-20">
              Aucun paiement reçu pour le moment.
            </div>
          )}

          {payouts.map((payout, index) => (
            <div key={payout.id} className="relative pl-10">

              {/* Ligne verticale */}
              {index !== payouts.length - 1 && (
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-300"></div>
              )}

              {/* Point */}
              <div className="absolute left-2 top-2 w-4 h-4 bg-black rounded-full"></div>

              {/* Carte */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Virement #{payout.id}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {new Date(payout.date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  <p className="text-2xl font-semibold text-gray-900">
                    {payout.amount} €
                  </p>
                </div>

                {/* Statut */}
                {payout.status && (
                  <span
                    className={`inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[payout.status]}`}
                  >
                    {statusLabels[payout.status]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
