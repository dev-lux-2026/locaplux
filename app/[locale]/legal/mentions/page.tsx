"use client";

export default function LegalMentionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0C]">
      <div className="max-w-4xl mx-auto py-12 px-4 lg:px-0 space-y-12">

        {/* HEADER */}
        <header className="space-y-3">
          <p className="text-xs font-medium tracking-[0.2em] text-gray-500 dark:text-gray-400 uppercase">
            Locaplux • Légal
          </p>

          <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white">
            Mentions légales
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            Informations légales obligatoires concernant l’éditeur, l’hébergement et la responsabilité de la plateforme Locaplux.
          </p>
        </header>

        {/* CONTENT */}
        <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm space-y-8">

          {/* 1. Éditeur */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              1. Éditeur du site
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Le site <strong>Locaplux</strong> est édité par&nbsp;:
              <br />
              <br />
              <strong>Locaplux Sàrl</strong>
              <br />
              Adresse : XXX, Luxembourg
              <br />
              Numéro RCS : XXX
              <br />
              Numéro de TVA intracommunautaire : XXX
              <br />
              Représentant légal : Frédéric XXX
              <br />
              <br />
              Email de contact : <strong>contact@locaplux.com</strong>
            </p>
          </div>

          {/* 2. Hébergement */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              2. Hébergement
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Le site Locaplux est hébergé par&nbsp;:
              <br />
              <br />
              <strong>Vercel Inc.</strong>
              <br />
              440 N Barranca Ave #4133
              <br />
              Covina, CA 91723
              <br />
              États‑Unis
              <br />
              <br />
              Site web : https://vercel.com
            </p>
          </div>

          {/* 3. Propriété intellectuelle */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              3. Propriété intellectuelle
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              L’ensemble des éléments présents sur Locaplux (textes, images, logos,
              éléments graphiques, structure du site, code, interfaces) est protégé
              par le droit d’auteur et les lois applicables en matière de propriété
              intellectuelle.
              <br />
              <br />
              Sauf mention contraire, ces éléments sont la propriété exclusive de
              Locaplux Sàrl ou de ses partenaires. Toute reproduction, représentation,
              modification, diffusion ou exploitation, totale ou partielle, sans
              autorisation écrite préalable est strictement interdite.
            </p>
          </div>

          {/* 4. Responsabilité */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              4. Responsabilité</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Locaplux est une plateforme d’intermédiation mettant en relation des
              vendeurs professionnels et des acheteurs particuliers. Locaplux n’est
              pas vendeur des produits proposés sur la plateforme.
              <br />
              <br />
              Locaplux ne peut être tenue responsable :
              <br />
              – des informations, descriptions ou prix fournis par les vendeurs,
              <br />
              – des produits vendus via la plateforme,
              <br />
              – des retards, pertes ou dommages liés à la livraison,
              <br />
              – des litiges entre vendeurs et acheteurs,
              <br />
              – des pertes financières liées à une transaction.
              <br />
              <br />
              Locaplux garantit uniquement le bon fonctionnement technique de la
              plateforme, dans la limite des moyens raisonnables.
            </p>
          </div>

          {/* 5. Données personnelles */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              5. Données personnelles
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Locaplux respecte le Règlement Général sur la Protection des Données
              (RGPD). Pour plus d’informations sur la collecte, l’utilisation et la
              conservation de vos données, veuillez consulter notre{" "}
              <a href="/legal/privacy" className="text-black dark:text-white underline">
                Politique de confidentialité
              </a>.
            </p>
          </div>

          {/* 6. Signalement et contact */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              6. Signalement et contact
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Pour toute demande relative aux mentions légales, ou pour signaler un
              contenu illicite ou problématique, vous pouvez contacter Locaplux via
              la messagerie sécurisée ou par email à <strong>contact@locaplux.com</strong>.
            </p>

            <a
              href="/messages/start?to=support"
              className="inline-flex items-center px-5 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition"
            >
              Contacter Locaplux
            </a>
          </div>

        </section>

      </div>
    </div>
  );
}
