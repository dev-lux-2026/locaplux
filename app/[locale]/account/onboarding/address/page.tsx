"use client";

import { useState, ChangeEvent, ReactNode } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import OnboardingProgress from "@/components/OnboardingProgress";

export default function OnboardingAddressPage() {
  const router = useRouter();
  const { locale } = useParams(); // locale dynamique

  const [billing, setBilling] = useState({
    street: "",
    number: "",
    zip: "",
    city: "",
    country: "",
    phone: "",
  });

  const [shipping, setShipping] = useState({
    street: "",
    number: "",
    zip: "",
    city: "",
    country: "",
    phone: "",
  });

  const [useDifferentShipping, setUseDifferentShipping] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !billing.street.trim() ||
      !billing.zip.trim() ||
      !billing.city.trim() ||
      !billing.country.trim()
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires de facturation.");
      return;
    }

    if (useDifferentShipping) {
      if (
        !shipping.street.trim() ||
        !shipping.zip.trim() ||
        !shipping.city.trim() ||
        !shipping.country.trim()
      ) {
        toast.error("Veuillez remplir tous les champs obligatoires de livraison.");
        return;
      }
    }

    const payload = {
      billing,
      shipping: useDifferentShipping ? shipping : billing,
    };

    const res = await fetch("/api/onboarding/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Erreur lors de l'enregistrement");
      return;
    }

    toast.success("Adresse enregistrée !");

    router.push(`/${locale}/account/onboarding/preferences`);
  }

  // Typage propre pour les inputs
  const handleBillingChange = (field: keyof typeof billing) => 
    (e: ChangeEvent<HTMLInputElement>) =>
      setBilling({ ...billing, [field]: e.target.value });

  const handleShippingChange = (field: keyof typeof shipping) => 
    (e: ChangeEvent<HTMLInputElement>) =>
      setShipping({ ...shipping, [field]: e.target.value });

  return (
    <div className="max-w-md mx-auto py-10">
      <OnboardingProgress step={2} />

      <h1 className="text-3xl font-bold mb-6">Adresse de facturation</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Adresse de facturation */}
        <div className="space-y-4">
          <input
            className="input"
            placeholder="Rue *"
            value={billing.street}
            onChange={handleBillingChange("street")}
          />

          <input
            className="input"
            placeholder="Numéro"
            value={billing.number}
            onChange={handleBillingChange("number")}
          />

          <input
            className="input"
            placeholder="Code postal *"
            value={billing.zip}
            onChange={handleBillingChange("zip")}
          />

          <input
            className="input"
            placeholder="Ville *"
            value={billing.city}
            onChange={handleBillingChange("city")}
          />

          <input
            className="input"
            placeholder="Pays *"
            value={billing.country}
            onChange={handleBillingChange("country")}
          />

          <input
            className="input"
            placeholder="Téléphone"
            value={billing.phone}
            onChange={handleBillingChange("phone")}
          />
        </div>

        {/* Checkbox livraison différente */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useDifferentShipping}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUseDifferentShipping(e.target.checked)
            }
          />
          <label>Adresse de livraison différente ?</label>
        </div>

        {/* Adresse de livraison */}
        {useDifferentShipping && (
          <div className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold">Adresse de livraison</h2>

            <input
              className="input"
              placeholder="Rue *"
              value={shipping.street}
              onChange={handleShippingChange("street")}
            />

            <input
              className="input"
              placeholder="Numéro"
              value={shipping.number}
              onChange={handleShippingChange("number")}
            />

            <input
              className="input"
              placeholder="Code postal *"
              value={shipping.zip}
              onChange={handleShippingChange("zip")}
            />

            <input
              className="input"
              placeholder="Ville *"
              value={shipping.city}
              onChange={handleShippingChange("city")}
            />

            <input
              className="input"
              placeholder="Pays *"
              value={shipping.country}
              onChange={handleShippingChange("country")}
            />

            <input
              className="input"
              placeholder="Téléphone"
              value={shipping.phone}
              onChange={handleShippingChange("phone")}
            />
          </div>
        )}

        <button className="btn-primary w-full" type="submit">
          Continuer
        </button>
      </form>
    </div>
  );
}
