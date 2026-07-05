"use client";

import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0C]">
      <div className="max-w-4xl mx-auto py-12 px-4 lg:px-0 space-y-12">

        {/* HEADER */}
        <header className="space-y-3">
          <p className="text-xs font-medium tracking-[0.2em] text-gray-500 dark:text-gray-400 uppercase">
            Locaplux • Support
          </p>

          <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white">
            Centre d’aide
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            Retrouvez ici les réponses aux questions les plus fréquentes et contactez notre équipe si nécessaire.
          </p>
        </header>

        {/* FAQ */}
        <section className="space-y-6">
          {[
            {
              q: "Comment fonctionne Locaplux ?",
              a: "Locaplux est une plateforme de location premium permettant aux clients de réserver des produits auprès de partenaires vérifiés, en toute sécurité."
            },
            {
              q: "Comment contacter un partenaire ?",
              a: "Toutes les communications passent par la messagerie sécurisée Locaplux. Aucun contact direct n’est partagé pour garantir votre sécurité."
            },
            {
              q: "Comment modifier ma réservation ?",
              a: "Vous pouvez gérer vos réservations depuis votre espace compte, dans la section « Mes commandes »."
            },
            {
              q: "Comment devenir partenaire Locaplux ?",
              a: "Vous pouvez créer un compte partenaire depuis la page d’inscription dédiée. Notre équipe validera ensuite votre profil."
            }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.q}
              </h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </section>

        {/* CONTACT SUPPORT */}
        <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Besoin d’aide ?
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Notre équipe est disponible pour vous accompagner.  
            Toutes les demandes passent par notre formulaire de contact.
          </p>

          <Link
            href="/support/contact"
            className="inline-flex items-center px-5 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition"
          >
            Contacter le support
          </Link>
        </section>

      </div>
    </div>
  );
}
