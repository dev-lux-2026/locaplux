"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: "",
    acceptTerms: false,
  });

  // Liste complète UE
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

  async function handleSubmit(e) {
    e.preventDefault();

    // Validation des champs obligatoires
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

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Veuillez entrer une adresse email valide.");
      return;
    }

    // Validation CGU / CGV
    if (!form.acceptTerms) {
      toast.error("Vous devez accepter les CGU et les CGV pour continuer.");
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Erreur lors de l'inscription");
      return;
    }

    toast.success("Compte créé");
    router.push("/account/onboarding/address");
  }

  return (
    <div className="max-w-md mx-auto py-12">

      {/* HEADER PREMIUM */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold mb-2">
          Créer votre compte
        </h1>

        <p className="text-gray-600 dark:text-gray-300 text-base">
          Accédez à une expérience premium et sécurisée.
        </p>
      </div>

      {/* FORMULAIRE */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-[#111] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10"
      >
        <input
          className="input"
          placeholder="Prénom"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />

        <input
          className="input"
          placeholder="Nom"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />

        <input
          className="input"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="input"
          placeholder="Mot de passe"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* Sélecteur de pays UE */}
        <select
          className="input"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
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

        {/* CASE À COCHER CGU / CGV */}
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
            <a href="/legal/terms" className="underline hover:text-black dark:hover:text-white">
              Conditions Générales d’Utilisation
            </a>{" "}
            et les{" "}
            <a href="/legal/cgv" className="underline hover:text-black dark:hover:text-white">
              Conditions Générales de Vente
            </a>.
          </label>
        </div>

        <button className="btn-primary w-full" type="submit">
          Continuer
        </button>
      </form>

      {/* FOOTER */}
      <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm">
        Déjà un compte ?{" "}
        <a
          href="/login"
          className="text-black dark:text-[#D4AF37] font-medium hover:underline"
        >
          Se connecter
        </a>
      </p>
    </div>
  );
}
