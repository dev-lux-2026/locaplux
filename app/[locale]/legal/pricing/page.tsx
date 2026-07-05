"use client";

import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0C]">
      <div className="max-w-5xl mx-auto py-12 px-4 lg:px-0 space-y-12">

        {/* HEADER */}
        <header className="space-y-3">
          <p className="text-xs font-medium tracking-[0.2em] text-gray-500 dark:text-gray-400 uppercase">
            Locaplux • Tarifs
          </p>

          <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white">
            Tarifs & Commissions (HTVA)
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            Tarifs transparents et adaptés aux partenaires professionnels.  
            Tous les prix sont indiqués <strong>hors TVA</strong>.
          </p>
        </header>

        {/* OFFRES */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* BRONZE */}
          <div className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Offre Bronze
            </h2>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              L’offre simple et flexible pour démarrer.
            </p>

            <p className="mt-6 text-4xl font-bold text-gray-900 dark:text-white">
              12%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              de commission HTVA par transaction
            </p>

            <ul className="mt-6 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• Produits illimités</li>
              <li>• Statistiques de base</li>
              <li>• Support standard</li>
              <li>• Mises en avant payantes :</li>
              <li className="ml-4">– Boost 24h : 2,99€ HTVA</li>
              <li className="ml-4">– Boost 7 jours : 9,99€ HTVA</li>
              <li className="ml-4">– Boost Premium 30 jours : 24,99€ HTVA</li>
            </ul>

            <Link
              href="/register/partner"
              className="mt-auto inline-block text-center px-5 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition"
            >
              Devenir partenaire
            </Link>
          </div>

          {/* ARGENT */}
          <div className="bg-white dark:bg-[#0F0F10] border-2 border-black dark:border-white rounded-2xl p-8 shadow-md flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Offre Argent
            </h2>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Pour les partenaires souhaitant plus de visibilité.
            </p>

            <p className="mt-6 text-4xl font-bold text-gray-900 dark:text-white">
              10%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              de commission HTVA + 49€/mois HTVA
            </p>

            <ul className="mt-6 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• Produits illimités</li>
              <li>• Badge Argent</li>
              <li>• Statistiques avancées</li>
              <li>• Support prioritaire</li>
              <li>• Mises en avant à prix réduit :</li>
              <li className="ml-4">– Boost 24h : 2,09€ HTVA</li>
              <li className="ml-4">– Boost 7 jours : 6,99€ HTVA</li>
              <li className="ml-4">– Boost Premium 30 jours : 17,49€ HTVA</li>
            </ul>

            <Link
              href="/register/partner"
              className="mt-auto inline-block text-center px-5 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition"
            >
              Devenir partenaire Argent
            </Link>
          </div>

          {/* GOLD */}
          <div className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Offre Gold
            </h2>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Pour les grandes structures ou volumes importants.
            </p>

            <p className="mt-6 text-4xl font-bold text-gray-900 dark:text-white">
              Sur mesure
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Commission & abonnement HTVA personnalisés
            </p>

            <ul className="mt-6 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• Produits illimités</li>
              <li>• Mises en avant incluses</li>
              <li>• Support prioritaire niveau 2</li>
              <li>• Accompagnement dédié</li>
              <li>• Conditions négociées selon volume & taux de réussite</li>
            </ul>

            <Link
              href="/messages/start?to=support"
              className="mt-auto inline-block text-center px-5 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition"
            >
              Contacter Locaplux
            </Link>
          </div>

        </section>

        {/* NOTE */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Tous les tarifs sont indiqués hors TVA.  
          Les conditions peuvent évoluer. Toute modification sera communiquée aux partenaires.
        </p>

      </div>
    </div>
  );
}
