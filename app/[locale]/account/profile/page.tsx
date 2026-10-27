"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const params = useParams();
  const locale = params?.locale || "fr";

  // Déterminer le statut affiché
  const displayStatus =
    user?.role === "partner"
      ? "Partenaire Locaplux"
      : "Acheteur Locaplux";

  // Détection stricte et professionnelle d'un profil incomplet
  const isProfileIncomplete = !user?.firstName || !user?.lastName;

  // Reconstruction propre du nom affiché à partir des deux colonnes distinctes
  const fullName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.name;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Bandeau d'invite officiel si les informations du compte ne sont pas finalisées */}
      {isProfileIncomplete && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-amber-900 text-sm">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <p>
              <strong>Votre profil n'est pas complètement configuré.</strong> Veuillez finaliser vos informations personnelles pour accéder à l'ensemble des services Locaplux.
            </p>
          </div>
          <Link 
            href={`/${locale}/account/onboarding/address`} 
            className="px-4 py-1.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition text-[13px] whitespace-nowrap"
          >
            Finaliser mon profil
          </Link>
        </div>
      )}

      <h1 className="text-3xl font-semibold text-gray-900">Mon profil</h1>

      <p className="text-gray-700 mt-2 text-[15px]">
        Retrouvez ici vos informations personnelles et votre activité sur Locaplux.
      </p>

      <div className="mt-10 flex flex-col gap-6">

        <div>
          <p className="text-sm text-gray-500">Nom & Prénom</p>
          <p className="text-lg font-medium">{fullName || "Non renseigné"}</p>
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
