"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

function ResetPasswordContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params?.locale || "fr";
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!token) {
      toast.error("Jeton de réinitialisation manquant ou invalide.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      setSuccess(true);
      toast.success("Mot de passe mis à jour avec succès !");
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 2000);
    } catch (err: any) {
      toast.error(err.message || "Impossible de réinitialiser le mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-3xl font-semibold text-gray-900">Nouveau mot de passe</h1>
      <p className="text-gray-700 mt-2 text-[15px] leading-relaxed">
        Veuillez entrer votre nouveau mot de passe ci-dessous.
      </p>

      {success ? (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm">
          Votre mot de passe a été modifié avec succès. Redirection vers la page de connexion...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition text-sm font-medium"
          >
            {loading ? "Mise à jour..." : "Enregistrer le nouveau mot de passe"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Chargement...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}