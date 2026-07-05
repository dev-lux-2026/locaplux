"use client";

import { useParams } from "next/navigation";

export default function PartnerSuccessPage() {
  const { locale } = useParams(); // ← locale dynamique (fr, en, lu)

  return (
    <div className="max-w-xl mx-auto py-24 px-6 text-center">
      <div className="mb-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-4">
        Votre demande a été envoyée
      </h1>

      <p className="text-gray-600 mb-10 leading-relaxed">
        Merci pour votre inscription en tant que partenaire Locaplux.
        Notre équipe va vérifier vos informations et vous recevrez un email
        dès que votre compte sera validé.
      </p>

      <div className="flex justify-center">
        <a
          href={`/${locale}/home`} // ← localisé
          className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Revenir à Locaplux
        </a>
      </div>
    </div>
  );
}
