"use client";

import Link from "next/link";

export default function PartnerSupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 lg:px-0 space-y-12">

        {/* HEADER */}
        <header>
          <p className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase">
            Locaplux • Support
          </p>

          <h1 className="mt-2 text-3xl lg:text-4xl font-semibold text-gray-900">
            Centre d’aide partenaire
          </h1>

          <p className="mt-3 text-sm text-gray-600 max-w-2xl">
            Retrouvez ici toutes les ressources pour vous aider à gérer votre activité :
            assistance, documentation, FAQ, support technique et informations sur votre compte.
          </p>
        </header>

        {/* SECTION — Support rapide */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Support rapide</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/partner/messages"
              className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition"
            >
              <p className="font-medium text-gray-900">Contacter un client</p>
              <p className="text-sm text-gray-600 mt-1">
                Accédez à vos conversations en cours.
              </p>
            </Link>

            <Link
              href="/partner/orders"
              className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition"
            >
              <p className="font-medium text-gray-900">Problème avec une commande</p>
              <p className="text-sm text-gray-600 mt-1">
                Consultez les détails et l’historique des commandes.
              </p>
            </Link>
          </div>
        </section>

        {/* SECTION — FAQ */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Questions fréquentes</h2>

          <div className="space-y-4">
            <FaqItem
              question="Comment activer mon compte Stripe ?"
              answer="Rendez-vous dans la section Paiements et suivez la procédure d’activation Stripe Connect."
            />

            <FaqItem
              question="Comment modifier mes informations professionnelles ?"
              answer="Vous pouvez mettre à jour vos informations dans la page Compte partenaire."
            />

            <FaqItem
              question="Comment être averti en temps réel ?"
              answer="Activez les notifications dans la page dédiée pour recevoir les alertes commandes, messages et paiements."
            />

            <FaqItem
              question="Comment gérer mes produits ?"
              answer="Ajoutez, modifiez ou désactivez vos produits depuis la page Produits."
            />
          </div>
        </section>

        {/* SECTION — Ressources */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Ressources utiles</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/partner/stripe"
              className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition"
            >
              <p className="font-medium text-gray-900">Stripe Connect</p>
              <p className="text-sm text-gray-600 mt-1">
                Vérifiez l’état de votre compte de paiement.
              </p>
            </Link>

            <Link
              href="/partner/payouts"
              className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition"
            >
              <p className="font-medium text-gray-900">Versements</p>
              <p className="text-sm text-gray-600 mt-1">
                Consultez l’historique de vos paiements.
              </p>
            </Link>

            <Link
              href="/partner/notifications"
              className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition"
            >
              <p className="font-medium text-gray-900">Notifications</p>
              <p className="text-sm text-gray-600 mt-1">
                Gérez vos préférences d’alertes.
              </p>
            </Link>

            <Link
              href="/partner/account"
              className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition"
            >
              <p className="font-medium text-gray-900">Compte partenaire</p>
              <p className="text-sm text-gray-600 mt-1">
                Mettez à jour vos informations professionnelles.
              </p>
            </Link>
          </div>
        </section>

        {/* SECTION — Assistance */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Assistance Locaplux</h2>

          <p className="text-sm text-gray-600">
            Une question, un problème ou un besoin spécifique ?  
            Notre équipe est disponible pour vous accompagner.
          </p>

          <a
            href="mailto:support@locaplux.com"
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900 transition"
          >
            Contacter le support
          </a>
        </section>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               FAQ COMPONENT                                 */
/* -------------------------------------------------------------------------- */

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group">
      <summary className="cursor-pointer text-sm font-medium text-gray-900 flex justify-between items-center">
        {question}
        <span className="text-gray-400 group-open:rotate-180 transition">⌄</span>
      </summary>

      <p className="mt-2 text-sm text-gray-600">{answer}</p>
    </details>
  );
}
