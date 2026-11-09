"use client";

import { useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { PasswordField } from "@/components/auth/PasswordField";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "fr";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd: string): string | null => {
    if (!pwd || pwd.length < 12) {
      return "Le mot de passe doit contenir au moins 12 caractères.";
    }
    const blacklist = ["password", "123456", "azerty", "qwerty", "locaplux", "admin", "welcome", "motdepasse"];
    const lower = pwd.toLowerCase();
    if (blacklist.some((bad) => lower.includes(bad))) {
      return "Ce mot de passe est trop faible ou trop courant.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    const validationError = validatePassword(password);
    if (validationError) {
      toast.error(validationError);
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

      toast.success("Mot de passe réinitialisé avec succès !");
      
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 1500);
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
        Veuillez choisir un nouveau mot de passe sécurisé pour votre compte.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        <PasswordField value={password} onChange={setPassword} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black bg-white shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="Répétez le mot de passe"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Mise à jour..." : "Enregistrer le nouveau mot de passe"}
        </button>
      </form>
    </div>
  );
}