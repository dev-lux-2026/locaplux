"use client";

import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Déterminer le statut affiché
  const displayStatus =
    user?.role === "partner"
      ? "Partenaire Locaplux"
      : "Acheteur Locaplux";

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-semibold text-gray-900">Mon profil</h1>

      <p className="text-gray-700 mt-2 text-[15px]">
        Retrouvez ici vos informations personnelles et votre activité sur Locaplux.
      </p>

      <div className="mt-10 flex flex-col gap-6">

        <div>
          <p className="text-sm text-gray-500">Nom</p>
          <p className="text-lg font-medium">{user?.name || "Non renseigné"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-lg font-medium">{user?.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Statut</p>
          <p className="text-lg font-medium">{displayStatus}</p>
        </div>

        {user?.role === "partner" && (
          <div className="pt-6 border-t">
            <p className="text-sm text-gray-500">Partenaire</p>
            <p className="text-[15px] text-gray-700 mt-1">
              Votre compte partenaire est actif. Vous pouvez gérer vos produits,
              vos commandes et vos informations professionnelles.
            </p>
          </div>
        )}

        {user?.role !== "partner" && (
          <div className="pt-6 border-t">
            <p className="text-sm text-gray-500">Partenaires</p>
            <p className="text-[15px] text-gray-700 mt-1">
              Vous achetez exclusivement auprès de partenaires professionnels,
              reconnus et vérifiés.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
