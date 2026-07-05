"use client";

export default function PartnerSettings() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0C]">
      <div className="max-w-3xl mx-auto py-12 px-4 lg:px-0 space-y-10">

        {/* HEADER */}
        <header>
          <p className="text-xs font-medium tracking-[0.2em] text-gray-500 dark:text-gray-400 uppercase">
            Locaplux • Paramètres
          </p>

          <h1 className="mt-2 text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white">
            Paramètres du compte
          </h1>

          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            Gérez vos informations, votre sécurité et vos préférences professionnelles.
          </p>
        </header>

        {/* SECTION — Informations du compte */}
        <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Informations du compte
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gérez les informations générales de votre compte partenaire.
          </p>

          <a
            href="/partner/account"
            className="inline-flex items-center px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm hover:bg-gray-900 dark:hover:bg-gray-200 transition"
          >
            Modifier mes informations
          </a>
        </section>

        {/* SECTION — Sécurité */}
        <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sécurité
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Changez votre mot de passe et gérez les accès à votre compte.
          </p>

          <button
            className="px-4 py-2 bg-gray-100 dark:bg-[#1A1A1C] text-gray-800 dark:text-gray-200 rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-[#2A2A2C] transition"
            onClick={() => alert("Fonction à implémenter")}
          >
            Modifier mon mot de passe
          </button>
        </section>

        {/* SECTION — Notifications */}
        <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choisissez comment vous souhaitez être averti des nouvelles commandes,
            messages et paiements.
          </p>

          <button
            className="px-4 py-2 bg-gray-100 dark:bg-[#1A1A1C] text-gray-800 dark:text-gray-200 rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-[#2A2A2C] transition"
            onClick={() => alert("Fonction à implémenter")}
          >
            Gérer mes notifications
          </button>
        </section>

        {/* SECTION — Paiements */}
        <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Paiements
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Configurez vos préférences de paiement et accédez à vos versements.
          </p>

          <a
            href="/partner/payouts"
            className="inline-flex items-center px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm hover:bg-gray-900 dark:hover:bg-gray-200 transition"
          >
            Voir mes versements
          </a>
        </section>

        {/* SECTION — Intégrations */}
        <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Intégrations
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gérez vos connexions externes, comme Stripe pour les paiements.
          </p>

          <a
            href="/partner/stripe"
            className="inline-flex items-center px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm hover:bg-gray-900 dark:hover:bg-gray-200 transition"
          >
            Gérer Stripe
          </a>
        </section>

      </div>
    </div>
  );
}
