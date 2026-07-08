"use client";

import { useState, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import OnboardingProgress from "@/components/OnboardingProgress";

export default function OnboardingPreferencesPage() {
  const router = useRouter();
  const { locale } = useParams(); // ← locale dynamique

  const [preferredLanguage, setPreferredLanguage] = useState<string>("fr");
  const [loadingEmail, setLoadingEmail] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch("/api/onboarding/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferredLanguage }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Erreur lors de l'enregistrement");
      return;
    }

    toast.success("Préférences enregistrées !");

    // 🔥 Redirection localisée
    router.push(`/${locale}/home`);
  }

  async function sendVerificationEmail() {
    setLoadingEmail(true);

    const res = await fetch("/api/auth/send-verification-email", {
      method: "POST",
    });

    setLoadingEmail(false);

    if (!res.ok) {
      toast.error("Impossible d'envoyer l'email");
      return;
    }

    toast.success("Email de validation envoyé !");
  }

  return (
    <div className="max-w-md mx-auto py-10">

      <OnboardingProgress step={3} />

      <h1 className="text-3xl font-bold mb-6">Vos préférences</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="space-y-3">
          <label className="font-medium">Langue préférée</label>

          <select
            className="input"
            value={preferredLanguage}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setPreferredLanguage(e.target.value)
            }
          >
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
            <option value="de">Allemand</option>
          </select>
        </div>

        <button className="btn-primary w-full" type="submit">
          Terminer
        </button>

        <div className="pt-4 border-t">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            Pour sécuriser votre compte, validez votre adresse email.
          </p>

          <button
            type="button"
            onClick={sendVerificationEmail}
            className="btn-secondary w-full"
            disabled={loadingEmail}
          >
            {loadingEmail ? "Envoi..." : "Envoyer l'email de validation"}
          </button>
        </div>
      </form>
    </div>
  );
}
