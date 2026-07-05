"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0C]">
      <div className="max-w-4xl mx-auto py-12 px-4 lg:px-0 space-y-16">

        {/* ===========================
            CGU — CLIENTS (ACHETEURS)
        ============================ */}
        <header className="space-y-3">
          <p className="text-xs font-medium tracking-[0.2em] text-gray-500 dark:text-gray-400 uppercase">
            Locaplux • Légal
          </p>

          <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white">
            Conditions Générales d’Utilisation — Acheteurs
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            Les présentes conditions s’appliquent aux utilisateurs achetant des produits via Locaplux.
          </p>
        </header>

        <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm space-y-10">

          {/* 1. Objet */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              1. Objet
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Locaplux est une plateforme d’intermédiation permettant la mise en relation entre des vendeurs professionnels (« Partenaires ») et des acheteurs particuliers (« Clients »). Locaplux n’est pas vendeur et n’intervient pas dans la transaction commerciale, la livraison, le service après‑vente ou les retours.
            </p>
          </div>

          {/* 2. Définitions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              2. Définitions
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              « Partenaire » : vendeur professionnel utilisant Locaplux pour proposer ses produits.<br />
              « Client » : acheteur particulier utilisant Locaplux pour passer commande.<br />
              « Commande » : achat conclu directement entre le Client et le Partenaire.<br />
              « Stripe Connect » : solution de paiement utilisée pour répartir automatiquement les fonds.
            </p>
          </div>

          {/* 3. Obligations des utilisateurs */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              3. Obligations des utilisateurs
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Le Client s’engage à fournir des informations exactes, à respecter les conditions du Partenaire et à contacter directement celui‑ci pour toute question relative à la commande, la livraison, les retours ou le service après‑vente.
            </p>
          </div>

          {/* 4. Responsabilités */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              4. Responsabilités
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Locaplux n’est pas partie au contrat de vente. Le Partenaire est seul responsable de la conformité des produits, des descriptions, des prix, des taxes, de la livraison, des retours, des remboursements et des garanties légales. Locaplux ne peut être tenu responsable des litiges entre Client et Partenaire.
            </p>
          </div>

          {/* 5. Données personnelles */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              5. Données personnelles
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Locaplux traite les données conformément au RGPD. Les données sont utilisées pour la gestion du compte, la mise en relation et la sécurité. Aucune donnée n’est vendue à des tiers.
            </p>
          </div>

          {/* 6. Contact */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              6. Contact
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Toute demande doit être effectuée via la messagerie sécurisée Locaplux.
            </p>
          </div>

        </section>

        {/* ===========================
            CGV — VENDEURS PARTENAIRES
        ============================ */}
        <header className="space-y-3 pt-10">
          <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white">
            Conditions Générales de Vente — Partenaires Professionnels
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            Les présentes conditions s’appliquent aux vendeurs professionnels utilisant Locaplux pour proposer leurs produits.
          </p>
        </header>

        <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm space-y-10">

          {/* 1. Objet */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              1. Objet
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Les présentes CGV définissent les obligations légales et commerciales des Partenaires professionnels utilisant Locaplux pour vendre leurs produits. Locaplux agit exclusivement en tant qu’intermédiaire technique.
            </p>
          </div>

          {/* 2. Obligations du Partenaire */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              2. Obligations du Partenaire
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Le Partenaire est seul responsable de la conformité des produits, des descriptions, des photos, des prix, des taxes, des stocks, de la livraison, des retours, des remboursements, des garanties légales et du service après‑vente. Il s’engage à respecter la législation luxembourgeoise et européenne.
            </p>
          </div>

          {/* 3. Paiement et commissions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              3. Paiement et commissions
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Les paiements sont traités via Stripe Connect. La part revenant au Partenaire et la commission Locaplux sont automatiquement réparties. Locaplux ne manipule jamais les fonds et ne gère pas les remboursements.
            </p>
          </div>

          {/* 4. Livraison */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              4. Livraison
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              La livraison est assurée exclusivement par le Partenaire. Celui‑ci est responsable des délais, des frais, des retards, des pertes et des dommages.
            </p>
          </div>

          {/* 5. Retours et garanties */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              5. Retours et garanties
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Le Partenaire gère directement les retours, les remboursements et les garanties légales. Locaplux n’intervient pas dans ces procédures.
            </p>
          </div>

          {/* 6. Suspension */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              6. Suspension et résiliation
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Locaplux peut suspendre ou résilier un compte Partenaire en cas de fraude, non‑conformité, litiges répétés, non‑respect des CGV ou comportement abusif.
            </p>
          </div>

        </section>

      </div>
    </div>
  );
}
