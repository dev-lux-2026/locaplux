"use client";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0C]">
      <div className="max-w-4xl mx-auto py-12 px-4 lg:px-0 space-y-12">

        {/* HEADER */}
        <header className="space-y-3">
          <p className="text-xs font-medium tracking-[0.2em] text-gray-500 dark:text-gray-400 uppercase">
            Locaplux • Légal
          </p>

          <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white">
            Politique de confidentialité (RGPD)
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            Cette politique explique comment Locaplux collecte, utilise et protège vos données personnelles conformément au RGPD.
          </p>
        </header>

        {/* CONTENT */}
        <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm space-y-8">

          {/* 1. Responsable du traitement */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              1. Responsable du traitement
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Le responsable du traitement des données personnelles est :
              <br /><br />
              <strong>Locaplux Sàrl</strong><br />
              Adresse : XXX, Luxembourg<br />
              Numéro RCS : XXX<br />
              Numéro de TVA : XXX<br />
              Email : <strong>contact@locaplux.com</strong>
            </p>
          </div>

          {/* 2. Données collectées */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              2. Données collectées
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Locaplux collecte uniquement les données nécessaires au fonctionnement de la plateforme, notamment :
            </p>

            <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Données de compte : nom, email, mot de passe chiffré</li>
              <li>Données de profil : adresse, préférences, informations vendeur</li>
              <li>Données de commande : produits achetés, montants, historique</li>
              <li>Données de paiement : gérées exclusivement par Stripe (Locaplux n’y a jamais accès)</li>
              <li>Données techniques : adresse IP, logs de sécurité, appareil utilisé</li>
              <li>Données de messagerie : échanges entre acheteurs et vendeurs</li>
            </ul>
          </div>

          {/* 3. Finalités du traitement */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              3. Finalités du traitement
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Les données sont utilisées pour :
            </p>

            <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Créer et gérer votre compte Locaplux</li>
              <li>Assurer le fonctionnement de la marketplace</li>
              <li>Gérer les commandes et transactions</li>
              <li>Assurer la sécurité et la prévention de la fraude</li>
              <li>Permettre la communication entre acheteurs et vendeurs</li>
              <li>Améliorer l’expérience utilisateur</li>
              <li>Respecter les obligations légales et fiscales</li>
            </ul>
          </div>

          {/* 4. Base légale */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              4. Base légale du traitement
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Les traitements reposent sur :
            </p>

            <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Votre consentement</li>
              <li>L’exécution d’un contrat (commande, compte utilisateur)</li>
              <li>L’intérêt légitime de Locaplux (sécurité, amélioration du service)</li>
              <li>Le respect d’obligations légales (facturation, lutte contre la fraude)</li>
            </ul>
          </div>

          {/* 5. Partage des données */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              5. Partage des données
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Locaplux ne vend jamais vos données. Elles peuvent être partagées uniquement avec :
            </p>

            <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Les vendeurs professionnels (pour traiter vos commandes)</li>
              <li>Stripe (paiements sécurisés)</li>
              <li>Les prestataires techniques (hébergement, emails, sécurité)</li>
              <li>Les autorités légales en cas d’obligation</li>
            </ul>
          </div>

          {/* 6. Durée de conservation */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              6. Durée de conservation
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Les données sont conservées :
            </p>

            <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              <li>tant que votre compte est actif,</li>
              <li>puis archivées pendant la durée légale obligatoire (facturation, fiscalité).</li>
            </ul>
          </div>

          {/* 7. Vos droits */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              7. Vos droits (RGPD)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Vous disposez des droits suivants :
            </p>

            <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Droit d’accès</li>
              <li>Droit de rectification</li>
              <li>Droit à l’effacement</li>
              <li>Droit d’opposition</li>
              <li>Droit à la portabilité</li>
              <li>Droit à la limitation du traitement</li>
            </ul>

            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Vous pouvez exercer ces droits via la messagerie sécurisée Locaplux ou par email à <strong>contact@locaplux.com</strong>.
            </p>
          </div>

          {/* 8. Sécurité */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              8. Sécurité des données
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Locaplux met en place des mesures techniques et organisationnelles pour protéger vos données :
            </p>

            <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Chiffrement des mots de passe</li>
              <li>Protection des accès</li>
              <li>Surveillance des connexions</li>
              <li>Stockage sécurisé</li>
              <li>Partenaires conformes au RGPD</li>
            </ul>
          </div>

          {/* 9. Contact DPO */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              9. Contact DPO
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Pour toute question relative à la protection des données, vous pouvez contacter le Délégué à la Protection des Données (DPO) de Locaplux à :
              <br />
              <strong>contact@locaplux.com</strong>
            </p>
          </div>

        </section>

      </div>
    </div>
  );
}
