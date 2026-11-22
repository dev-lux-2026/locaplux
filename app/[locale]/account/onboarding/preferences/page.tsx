"use client";

import { useState, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import OnboardingProgress from "@/components/OnboardingProgress";

export default function OnboardingPreferencesPage() {
  const router = useRouter();
  const { locale } = useParams();

  const [preferredLanguage, setPreferredLanguage] = useState<string>("fr");
  const [submitting, setSubmitting] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/onboarding/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: {
            preferredLanguage,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erreur lors de l'enregistrement");
        return;
      }

      toast.success("Préférences enregistrées !");
      router.push(`/${locale}/home`);
    } finally {
      setSubmitting(false);
    }
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

        <button className="btn-primary w-full" type="submit" disabled={submitting}>
          {submitting ? "Enregistrement..." : "Terminer"}
        </button>
      </form>
    </div>
  );
}