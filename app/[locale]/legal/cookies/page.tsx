"use client";

import Link from "next/link";

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <header>
        <p className="text-xs font-medium tracking-[0.2em] text-neutral-500 dark:text-neutral-400 uppercase">
          Locaplux • Cookies
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-neutral-900 dark:text-white">
          Gestion des cookies
        </h1>

        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
          Cette page explique comment Locaplux utilise les cookies et technologies similaires
          afin d’assurer le bon fonctionnement de la plateforme et d’améliorer votre expérience.
        </p>
      </header>

      <section className="space-y-6 text-sm text-neutral-700 dark:text-neutral-300">

        <div>
          <h2 className="text-lg font-semibold">1. Rôle de Locaplux</h2>
          <p className="mt-2">
            Locaplux est une plateforme de mise en relation entre vendeurs partenaires et acheteurs.
            Locaplux ne vend pas de produits et n’utilise pas de cookies à des fins commerciales
            pour son propre compte. Les cookies utilisés servent uniquement au fonctionnement
            technique, à la sécurité et, si activés, à la mesure d’audience.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">2. Qu’est-ce qu’un cookie ?</h2>
          <p className="mt-2">
            Un cookie est un petit fichier stocké sur votre appareil permettant de mémoriser
            certaines informations afin d’améliorer votre navigation ou de sécuriser votre session.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">3. Cookies strictement nécessaires</h2>
          <p className="mt-2">
            Ces cookies sont indispensables au fonctionnement de Locaplux. Ils ne peuvent pas être
            désactivés car ils garantissent :
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>l’authentification sécurisée,</li>
            <li>la gestion du panier,</li>
            <li>la navigation entre les pages,</li>
            <li>la protection contre la fraude et les accès non autorisés.</li>
          </ul>
          <p className="mt-2">
            Ces cookies ne collectent aucune donnée personnelle à des fins marketing.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">4. Cookies de mesure d’audience (optionnels)</h2>
          <p className="mt-2">
            Ces cookies permettent de comprendre comment les utilisateurs naviguent sur Locaplux
            afin d’améliorer les performances et l’expérience générale.
          </p>
          <p className="mt-2">
            Ils ne sont activés qu’avec votre consentement explicite.
          </p>
          <p className="mt-2">
            Exemples de services pouvant être utilisés :
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Google Analytics (anonymisé),</li>
            <li>Matomo,</li>
            <li>Hotjar (analyse UX).</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold">5. Cookies marketing (désactivés par défaut)</h2>
          <p className="mt-2">
            Locaplux n’utilise pas de cookies publicitaires ou de suivi marketing. Si un vendeur
            partenaire utilise des outils externes sur ses pages, il en est seul responsable.
          </p>
          <p className="mt-2">
            Locaplux ne transmet aucune donnée personnelle à des tiers à des fins publicitaires.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">6. Gestion de vos préférences</h2>
          <p className="mt-2">
            Vous pouvez accepter ou refuser les cookies optionnels à tout moment via la bannière
            de consentement ou depuis les paramètres de votre navigateur.
          </p>
          <p className="mt-2">
            Les cookies strictement nécessaires restent actifs pour garantir la sécurité et le bon
            fonctionnement de la plateforme.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">7. Durée de conservation</h2>
          <p className="mt-2">
            Les cookies sont conservés pour une durée maximale de 13 mois, conformément à la
            réglementation en vigueur.
          </p>
        </div>

      </section>

      <div className="pt-4">
        <Link href="/" className="text-sm text-lp-blue hover:underline">
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}
