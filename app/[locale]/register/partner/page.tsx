"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";

export default function RegisterPartner() {
  const { locale } = useParams();

  const EU_COUNTRIES = [
    { name: "Allemagne", prefix: "+49" },
    { name: "Autriche", prefix: "+43" },
    { name: "Belgique", prefix: "+32" },
    { name: "Bulgarie", prefix: "+359" },
    { name: "Chypre", prefix: "+357" },
    { name: "Croatie", prefix: "+385" },
    { name: "Danemark", prefix: "+45" },
    { name: "Espagne", prefix: "+34" },
    { name: "Estonie", prefix: "+372" },
    { name: "Finlande", prefix: "+358" },
    { name: "France", prefix: "+33" },
    { name: "Grèce", prefix: "+30" },
    { name: "Hongrie", prefix: "+36" },
    { name: "Irlande", prefix: "+353" },
    { name: "Italie", prefix: "+39" },
    { name: "Lettonie", prefix: "+371" },
    { name: "Lituanie", prefix: "+370" },
    { name: "Luxembourg", prefix: "+352" },
    { name: "Malte", prefix: "+356" },
    { name: "Pays-Bas", prefix: "+31" },
    { name: "Pologne", prefix: "+48" },
    { name: "Portugal", prefix: "+351" },
    { name: "République Tchèque", prefix: "+420" },
    { name: "Roumanie", prefix: "+40" },
    { name: "Slovaquie", prefix: "+421" },
    { name: "Slovénie", prefix: "+386" },
    { name: "Suède", prefix: "+46" },
  ];

  const SHORT_COUNTRIES = [
    { name: "Luxembourg", prefix: "+352" },
    { name: "Belgique", prefix: "+32" },
    { name: "France", prefix: "+33" },
    { name: "Allemagne", prefix: "+49" },
  ];

  const [showFullCountries, setShowFullCountries] = useState(false);
  const [prefixManuallyEdited, setPrefixManuallyEdited] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    publicName: "",
    email: "",
    street: "",
    number: "",
    postal: "",
    city: "",
    country: "Luxembourg",
    phonePrefix: "+352",
    phone: "",
    vat: "",
    website: "",
    acceptPartnerTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const restoring = useRef(true);

  useEffect(() => {
    const saved = localStorage.getItem("register-partner-form");
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch (e) {
        console.error("Erreur chargement sauvegarde :", e);
      }
    }
    setTimeout(() => {
      restoring.current = false;
    }, 50);
  }, []);

  useEffect(() => {
    if (!restoring.current) {
      localStorage.setItem("register-partner-form", JSON.stringify(form));
    }
  }, [form]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    if (name === "country") {
      if (!prefixManuallyEdited) {
        const match = EU_COUNTRIES.find((c) => c.name === value);
        if (match) {
          setForm({ ...form, country: value, phonePrefix: match.prefix });
          return;
        }
      }
      setForm({ ...form, country: value });
      return;
    }

    if (name === "phonePrefix") {
      setPrefixManuallyEdited(true);

      if (!value.startsWith("+")) {
        setForm({ ...form, phonePrefix: "+" });
        return;
      }

      if (value.trim() === "+") {
        setForm({ ...form, phonePrefix: "+" });
        return;
      }

      setForm({ ...form, phonePrefix: value });
      return;
    }

    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!/^\+\d{1,4}$/.test(form.phonePrefix)) {
      alert("Veuillez entrer un préfixe téléphonique valide.");
      return;
    }

    if (!form.acceptPartnerTerms) {
      alert("Vous devez accepter les CGV Partenaires.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      setLoading(false);

      if (res.ok) {
        localStorage.removeItem("register-partner-form");
        window.location.href = `/${locale}/register/partner/success`;
        return;
      }

      alert(
        data.error ||
          "Erreur lors de l’envoi (aucun message d’erreur reçu). Vérifie la console."
      );
    } catch (err) {
      setLoading(false);
      alert("Erreur réseau lors de l’envoi.");
    }
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Devenir partenaire</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">

        {/* INFORMATIONS PERSONNELLES */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1">Prénom</label>
              <input
                name="firstName"
                className="w-full border rounded px-3 py-2"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex-1">
              <label className="block mb-1">Nom</label>
              <input
                name="lastName"
                className="w-full border rounded px-3 py-2"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* INFORMATIONS LÉGALES */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Informations légales</h2>

          <div>
            <label className="block mb-1">Raison sociale</label>
            <input
              name="company"
              className="w-full border rounded px-3 py-2"
              value={form.company}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Nom commercial</label>
            <input
              name="publicName"
              className="w-full border rounded px-3 py-2"
              value={form.publicName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Numéro de TVA</label>
            <input
              name="vat"
              className="w-full border rounded px-3 py-2"
              value={form.vat}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Coordonnées professionnelles</h2>

          <div>
            <label className="block mb-1">Email professionnel</label>
            <input
              type="email"
              name="email"
              className="w-full border rounded px-3 py-2"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* ADRESSE */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Adresse de l’entreprise</h2>

          <div>
            <label className="block mb-1">Rue (optionnel)</label>
            <input
              name="street"
              className="w-full border rounded px-3 py-2"
              value={form.street}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1">Numéro (optionnel)</label>
              <input
                name="number"
                className="w-full border rounded px-3 py-2"
                value={form.number}
                onChange={handleChange}
              />
            </div>

            <div className="flex-1">
              <label className="block mb-1">Code postal</label>
              <input
                name="postal"
                className="w-full border rounded px-3 py-2"
                value={form.postal}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Ville (optionnel)</label>
            <input
              name="city"
              className="w-full border rounded px-3 py-2"
              value={form.city}
              onChange={handleChange}
            />
          </div>

          <div className="mt-4">
            <label className="block mb-1">Pays</label>

            {!showFullCountries && (
              <>
                <select
                  name="country"
                  className="w-full border rounded px-3 py-2"
                  value={form.country}
                  onChange={handleChange}
                >
                  {SHORT_COUNTRIES.map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowFullCountries(true)}
                  className="mt-2 px-3 py-1 border rounded text-sm"
                >
                  Autre pays
                </button>
              </>
            )}

            {showFullCountries && (
              <select
                name="country"
                className="w-full border rounded px-3 py-2"
                value={form.country}
                onChange={handleChange}
              >
                {EU_COUNTRIES.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* TÉLÉPHONE */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Téléphone professionnel</h2>

          <div className="flex gap-3">
            <input
              name="phonePrefix"
              className="w-24 border rounded px-3 py-2"
              value={form.phonePrefix}
              onChange={handleChange}
              required
            />

            <input
              name="phone"
              className="flex-1 border rounded px-3 py-2"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* OPTIONNEL */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Informations optionnelles</h2>

          <div>
            <label className="block mb-1">Site web (optionnel)</label>
            <input
              name="website"
              className="w-full border rounded px-3 py-2"
              value={form.website}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* CGV PARTENAIRES */}
        <div className="flex items-start space-x-3 pt-2">
          <input
            type="checkbox"
            id="acceptPartnerTerms"
            checked={form.acceptPartnerTerms}
            onChange={(e) =>
              setForm({ ...form, acceptPartnerTerms: e.target.checked })
            }
            className="mt-1 h-4 w-4 rounded border-gray-300 dark:border-gray-600"
            required
          />

          <label
            htmlFor="acceptPartnerTerms"
            className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
          >
            J’accepte les{" "}
            <a
              href={`/${locale}/legal/cgv`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-black dark:hover:text-white"
            >
              Conditions Générales de Vente Partenaires
            </a>.
          </label>
        </div>

        {/* CONTACT AVANT INSCRIPTION */}
        <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Une question avant de devenir partenaire ?
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Notre équipe Locaplux est disponible pour répondre à vos questions
            avant votre inscription. Toutes les communications passent par la
            messagerie sécurisée Locaplux.
          </p>

          <a
            href={`/${locale}/support/contact`}
            className="inline-flex items-center px-5 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition"
          >
            Contacter Locaplux
          </a>
        </section>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-3 bg-black text-white rounded text-sm"
        >
          {loading ? "Envoi..." : "Envoyer la demande"}
        </button>

      </form>
    </div>
  );
}
