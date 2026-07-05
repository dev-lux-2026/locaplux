"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DeleteAccountPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      return;
    }

    setLoading(true);

    try:
      const res = await fetch("/api/account/delete", {
        method: "POST",
      });

      if (!res.ok) {
        alert("Erreur lors de la suppression du compte.");
        setLoading(false);
        return;
      }

      // Déconnexion
      await signOut({ redirect: false });

      // Redirection
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
        Suppression du compte
      </h1>

      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        La suppression de votre compte entraînera l’effacement définitif de vos
        données personnelles : profil, messages, questions, wishlist, adresses.
      </p>

      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Vos commandes passées seront conservées sous forme anonymisée, conformément
        aux obligations légales.
      </p>

      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-6 py-3 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition disabled:opacity-50"
      >
        {loading ? "Suppression en cours..." : "Supprimer mon compte"}
      </button>
    </div>
  );
}
