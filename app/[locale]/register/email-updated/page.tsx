"use client";

import { useParams } from "next/navigation";

export default function EmailUpdatedPage() {
  const { locale } = useParams(); // ← même si pas utilisé, c’est correct pour i18n

  return (
    <div className="max-w-md mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Email mis à jour</h1>

      <p className="text-gray-600 mb-6">
        Votre adresse email a été modifiée avec succès.
        Un nouveau lien de validation vient de vous être envoyé.
      </p>

      <p className="text-gray-500 text-sm">
        Vous pouvez maintenant vérifier votre boîte mail pour activer votre compte.
      </p>
    </div>
  );
}
