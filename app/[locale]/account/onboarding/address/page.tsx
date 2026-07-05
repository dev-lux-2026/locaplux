"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import OnboardingProgress from "@/components/OnboardingProgress";

export default function OnboardingAddressPage() {
  const router = useRouter();
  const { locale } = useParams(); // ← locale dynamique

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

  const [useDifferentShipping, setUseDifferentShipping] = useState(false);

  async function handleSubmit(e) {
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

    // 🔥 Redirection localisée
    router.push(`/${locale}/account/onboarding/preferences`);
  }

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
            onChange={(e) =>
              setBilling({ ...billing, street: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Numéro"
            value={billing.number}
            onChange={(e) =>
              setBilling({ ...billing, number: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Code postal *"
            value={billing.zip}
            onChange={(e) => setBilling({ ...billing, zip: e.target.value })}
          />

          <input
            className="input"
            placeholder="Ville *"
            value={billing.city}
            onChange={(e) => setBilling({ ...billing, city: e.target.value })}
          />

          <input
            className="input"
            placeholder="Pays *"
            value={billing.country}
            onChange={(e) =>
              setBilling({ ...billing, country: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Téléphone"
            value={billing.phone}
            onChange={(e) =>
              setBilling({ ...billing, phone: e.target.value })
            }
          />
        </div>

        {/* Checkbox livraison différente */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useDifferentShipping}
            onChange={(e) => setUseDifferentShipping(e.target.checked)}
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
              onChange={(e) =>
                setShipping({ ...shipping, street: e.target.value })
              }
            />

            <input
              className="input"
              placeholder="Numéro"
              value={shipping.number}
              onChange={(e) =>
                setShipping({ ...shipping, number: e.target.value })
              }
            />

            <input
              className="input"
              placeholder="Code postal *"
              value={shipping.zip}
              onChange={(e) =>
                setShipping({ ...shipping, zip: e.target.value })
              }
            />

            <input
              className="input"
              placeholder="Ville *"
              value={shipping.city}
              onChange={(e) =>
                setShipping({ ...shipping, city: e.target.value })
              }
            />

            <input
              className="input"
              placeholder="Pays *"
              value={shipping.country}
              onChange={(e) =>
                setShipping({ ...shipping, country: e.target.value })
              }
            />

            <input
              className="input"
              placeholder="Téléphone"
              value={shipping.phone}
              onChange={(e) =>
                setShipping({ ...shipping, phone: e.target.value })
              }
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
