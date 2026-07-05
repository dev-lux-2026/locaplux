"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SuccessPage() {
  useEffect(() => {
    // On vide le panier côté client après un paiement réussi
    localStorage.removeItem("cart");
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-20 text-center animate-fade-in-up">
      <h1 className="text-4xl font-bold mb-4 text-[#1A3A5F]">
        Paiement réussi 🎉
      </h1>

      <p className="text-gray-700 text-lg mb-6">
        Merci pour votre achat. Votre commande est en cours de traitement.
      </p>

      <p className="text-gray-500 text-sm mb-10">
        Vous pouvez suivre l’état de votre commande dans votre espace client.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/account/orders"
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition"
        >
          Voir mes commandes
        </Link>

        <Link
          href="/home"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retour à l&apos;accueil
        </Link>

        <Link
          href="/search"
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Continuer vos achats
        </Link>
      </div>
    </div>
  );
}
