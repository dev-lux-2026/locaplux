"use client";

import { useParams } from "next/navigation";

export default function CheckEmailPage() {
  const { locale } = useParams(); // ← locale dynamique (fr, en, lu)

  return (
    <div className="max-w-md mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Vérifiez votre boîte mail</h1>

      <p className="text-gray-600 mb-6">
        Nous vous avons envoyé un email de confirmation.
        Cliquez sur le lien pour activer votre compte.
      </p>

      <div className="space-y-4">
        {/* API → NON localisée */}
        <a
          href="/api/auth/resend-verification"
          className="block w-full bg-black text-white py-3 rounded-md"
        >
          Renvoyer l’email de validation
        </a>

        {/* 🔥 Lien localisé */}
        <a
          href={`/${locale}/register/change-email`}
          className="block w-full text-black underline"
        >
          Modifier mon adresse email
        </a>
      </div>
    </div>
  );
}
