"use client";

import Link from "next/link";

export default function BuyerIntro() {
  return (
    <section className="w-full bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">

        <h2 className="text-2xl font-semibold text-gray-900">
          Achetez mieux, vivez mieux.
        </h2>

        <p className="text-gray-700 text-[15px] leading-relaxed max-w-2xl">
          <strong>Locaplux vous aide à acheter mieux, en toute confiance.</strong><br />
          Ici se réunissent des opportunités rares : exclusivités, fins de collections, pièces uniques,
          vides‑stocks premium et articles de marques proposés à prix doux, parfois même exceptionnels.
          Les partenaires présents sur Locaplux sont des professionnels reconnus et vérifiés, sélectionnés
          pour la qualité et l’authenticité de leurs offres.
          C’est un espace unique où excellence, rareté et bonnes affaires se croisent — un lieu que vous
          ne trouverez nulle part ailleurs.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">

          <Link
            href="/login"
            className="text-[13px] px-5 py-2 border border-black rounded hover:bg-black hover:text-white transition"
          >
            Se connecter
          </Link>

          <Link
            href="/home/explore"
            className="text-[13px] px-5 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Explorer sans connexion
          </Link>

        </div>
      </div>
    </section>
  );
}
