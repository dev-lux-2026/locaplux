"use client";

import Link from "next/link";

export default function CGVPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <header>
        <p className="text-xs font-medium tracking-[0.2em] text-neutral-500 dark:text-neutral-400 uppercase">
          Locaplux • Conditions Générales de Vente
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-neutral-900 dark:text-white">
          Conditions Générales de Vente (CGV) — Partenaires Professionnels
        </h1>

        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
          Les présentes Conditions Générales de Vente encadrent les obligations
          légales et commerciales des vendeurs professionnels utilisant Locaplux
          pour proposer leurs produits aux acheteurs.
        </p>
      </header>

      <section className="space-y-6 text-sm text-neutral-700 dark:text-neutral-300">

        {/* 1. Rôle de Locaplux */}
        <div>
          <h2 className="text-lg font-semibold">1. Rôle de Locaplux</h2>
          <p className="mt-2">
            Locaplux est une plateforme d’intermédiation permettant à des
            vendeurs exclusivement professionnels (« Partenaires ») de proposer
            leurs produits à des acheteurs particuliers (« Clients »).
          </p>
          <p className="mt-2">
            Locaplux n’est pas vendeur des produits proposés sur la plateforme.
            Les contrats de vente sont conclus directement entre le Partenaire
            et le Client. Locaplux n’est jamais partie au contrat.
          </p>
          <p className="mt-2">
            Locaplux fournit uniquement l’infrastructure technique, les outils
            de paiement, la gestion des commandes, la messagerie et les services
            facilitant la transaction.
          </p>
        </div>

        {/* 2. Obligations du vendeur */}
        <div>
          <h2 className="text-lg font-semibold">2. Obligations du Partenaire</h2>
          <p className="mt-2">
            Le Partenaire professionnel est seul responsable :
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>de la conformité des produits,</li>
            <li>de la véracité des descriptions,</li>
            <li>de la qualité et de la sécurité des produits,</li>
            <li>de la disponibilité des stocks,</li>
            <li>du respect des obligations légales (garanties, conformité, normes),</li>
            <li>de la livraison, des délais et des frais,</li>
            <li>du service après‑vente,</li>
            <li>des retours et remboursements,</li>
            <li>des taxes, TVA et obligations fiscales,</li>
            <li>de la gestion des litiges avec les Clients.</li>
          </ul>
          <p className="mt-2">
            Locaplux ne contrôle pas physiquement les produits et ne garantit
            pas leur conformité. Toute réclamation liée au produit doit être
            adressée directement au Partenaire.
          </p>
        </div>

        {/* 3. Commandes */}
        <div>
          <h2 className="text-lg font-semibold">3. Commandes</h2>
          <p className="mt-2">
            Lorsqu’un Client passe commande, celle‑ci est transmise au Partenaire
            qui en assure l’acceptation, la préparation et l’expédition.
          </p>
          <p className="mt-2">
            Locaplux peut afficher l’état de la commande, mais ne garantit pas
            les délais annoncés par les Partenaires.
          </p>
        </div>

        {/* 4. Paiement & Stripe Connect */}
        <div>
          <h2 className="text-lg font-semibold">4. Paiement et commissions</h2>
          <p className="mt-2">
            Les paiements sont traités via Stripe Connect. Les fonds sont
            automatiquement répartis entre :
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>la part revenant au Partenaire,</li>
            <li>la commission Locaplux.</li>
          </ul>
          <p className="mt-2">
            Locaplux ne manipule jamais directement les fonds et ne gère pas les
            remboursements. Toute demande de remboursement doit être traitée par
            le Partenaire via son interface Stripe Connect.
          </p>
        </div>

        {/* 5. Livraison */}
        <div>
          <h2 className="text-lg font-semibold">5. Livraison</h2>
          <p className="mt-2">
            La livraison est assurée exclusivement par le Partenaire ou par le
            transporteur qu’il mandate. Les délais, frais et modalités de
            livraison sont définis par le Partenaire.
          </p>
          <p className="mt-2">
            Locaplux n’est pas responsable des retards, pertes, erreurs
            d’acheminement ou dommages liés à la livraison.
          </p>
        </div>

        {/* 6. Retours & garanties */}
        <div>
          <h2 className="text-lg font-semibold">6. Retours, rétractation et garanties</h2>
          <p className="mt-2">
            Le Partenaire est seul responsable de la gestion :
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>du droit de rétractation,</li>
            <li>des retours,</li>
            <li>des remboursements,</li>
            <li>des garanties légales de conformité,</li>
            <li>des garanties contre les vices cachés.</li>
          </ul>
          <p className="mt-2">
            Locaplux n’intervient pas dans ces procédures et ne peut être tenue
            responsable des décisions prises par le Partenaire.
          </p>
        </div>

        {/* 7. Litiges */}
        <div>
          <h2 className="text-lg font-semibold">7. Litiges</h2>
          <p className="mt-2">
            En cas de litige entre un Client et un Partenaire, les parties
            doivent tenter de résoudre le différend via la messagerie Locaplux ou
            via le support.
          </p>
          <p className="mt-2">
            Locaplux peut intervenir en tant que médiateur technique, mais ne
            peut imposer aucune décision et n’est pas responsable de l’issue du
            litige.
          </p>
        </div>

        {/* 8. Responsabilité Locaplux */}
        <div>
          <h2 className="text-lg font-semibold">8. Responsabilité de Locaplux</h2>
          <p className="mt-2">
            Locaplux ne peut être tenue responsable :
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>des descriptions erronées fournies par les Partenaires,</li>
            <li>des retards ou défauts de livraison,</li>
            <li>des produits non conformes ou défectueux,</li>
            <li>des litiges entre Partenaires et Clients,</li>
            <li>des pertes financières liées à une transaction.</li>
          </ul>
          <p className="mt-2">
            Locaplux garantit uniquement le bon fonctionnement technique de la
            plateforme.
          </p>
        </div>

        {/* 9. Suspension */}
        <div>
          <h2 className="text-lg font-semibold">9. Suspension et résiliation</h2>
          <p className="mt-2">
            Locaplux peut suspendre ou résilier un compte Partenaire en cas de :
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>fraude ou tentative de fraude,</li>
            <li>non‑conformité répétée des produits,</li>
            <li>litiges récurrents avec les Clients,</li>
            <li>non‑respect des présentes CGV,</li>
            <li>comportement abusif ou dangereux.</li>
          </ul>
        </div>

        {/* 10. Modifications */}
        <div>
          <h2 className="text-lg font-semibold">10. Modification des CGV</h2>
          <p className="mt-2">
            Locaplux peut modifier les présentes CGV à tout moment. Les
            modifications s’appliquent immédiatement aux nouvelles commandes.
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
