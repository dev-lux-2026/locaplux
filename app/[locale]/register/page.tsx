"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "fr";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: "",
    acceptTerms: false,
  });

  const [loading, setLoading] = useState(false);

  const euCountries = [
    { code: "LU", name: "Luxembourg" },
    { code: "BE", name: "Belgique" },
    { code: "FR", name: "France" },
    { code: "separator", name: "──────────" },
    { code: "DE", name: "Allemagne" },
    { code: "AT", name: "Autriche" },
    { code: "BG", name: "Bulgarie" },
    { code: "CY", name: "Chypre" },
    { code: "HR", name: "Croatie" },
    { code: "DK", name: "Danemark" },
    { code: "ES", name: "Espagne" },
    { code: "EE", name: "Estonie" },
    { code: "FI", name: "Finlande" },
    { code: "GR", name: "Grèce" },
    { code: "HU", name: "Hongrie" },
    { code: "IE", name: "Irlande" },
    { code: "IT", name: "Italie" },
    { code: "LV", name: "Lettonie" },
    { code: "LT", name: "Lituanie" },
    { code: "MT", name: "Malte" },
    { code: "NL", name: "Pays-Bas" },
    { code: "PL", name: "Pologne" },
    { code: "PT", name: "Portugal" },
    { code: "CZ", name: "République Tchèque" },
    { code: "RO", name: "Roumanie" },
    { code: "SK", name: "Slovaquie" },
    { code: "SI", name: "Slovénie" },
    { code: "SE", name: "Suède" },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.country.trim()
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Veuillez entrer une adresse email valide.");
      return;
    }

    if (!form.acceptTerms) {
      toast.error("Vous devez accepter les CGU et les CGV pour continuer.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        // ✨ Affiche instantanément le message explicatif précis envoyé par l'API (ex: Email déjà pris)
        toast.error(data.error || "Une erreur est survenue lors de l'inscription.");
        return;
      }

      toast.success("Compte créé avec succès !");
      router.push(`/${locale}/account/onboarding/address`);
    } catch (err) {
      setLoading(false);
      toast.error("Une erreur technique est survenue. Veuillez réessayer.");
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4 text-black">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold mb-2 text-gray-900">Créer votre compte</h1>
        <p className="text-gray-600 dark:text-gray-300 text-base">
          Accédez à une expérience premium et sécurisée.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-[#111] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10"
      >
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
          placeholder="Prénom"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          required
        />

        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
          placeholder="Nom"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          required
        />

        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
          placeholder="Mot de passe"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          required
        >
          <option value="">Sélectionnez votre pays</option>
          {euCountries.map((c) =>
            c.code === "separator" ? (
              <option key="sep" disabled>
                {c.name}
              </option>
            ) : (
              <option key={c.code} value={c.name}>
                {c.name}
              </option>
            )
          )}
        </select>

        <div className="flex items-start space-x-3 pt-2">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={form.acceptTerms}
            onChange={(e) => setForm({ ...form, acceptTerms: e.target.checked })}
            className="mt-1 h-4 w-4 rounded border-gray-300 dark:border-gray-600"
            required
          />

          <label
            htmlFor="acceptTerms"
            className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
          >
            J’accepte les{" "}
            <Link
              href={`/${locale}/legal/terms`}
              className="underline hover:text-black dark:hover:text-white"
            >
              Conditions Générales d’Utilisation
            </Link>{" "}
            et les{" "}
            <Link
              href={`/${locale}/legal/cgv`}
              className="underline hover:text-black dark:hover:text-white"
            >
              Conditions Générales de Vente
            </Link>.
          </label>
        </div>

        <button 
          className="w-full px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 disabled:bg-gray-400 transition text-sm font-medium" 
          type="submit"
          disabled={loading}
        >
          {loading ? "Création du compte..." : "Continuer"}
        </button>
      </form>

      <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm">
        Déjà un compte ?{" "}
        <Link
          href={`/${locale}/login`}
          className="text-black dark:text-[#D4AF37] font-medium hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
