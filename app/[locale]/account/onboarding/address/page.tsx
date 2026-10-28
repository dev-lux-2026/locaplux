"use client";

import { useState, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // ✨ Ajout pour manipuler la session cliente
import toast from "react-hot-toast";
import OnboardingProgress from "@/components/OnboardingProgress";

export default function OnboardingAddressPage() {
  const params = useParams();
  const router = useRouter();
  const { update } = useSession(); // ✨ Récupération de la méthode de mise à jour du cookie
  const locale = params?.locale || "fr";

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
  const [loading, setLoading] = useState<boolean>(false);

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

    setLoading(true);

    try {
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
        setLoading(false);
        return;
      }

      toast.success("Adresse enregistrée avec succès !");

      // 🚀 FIX CRITIQUE : Force Next-Auth à rafraîchir instantanément le jeton JWT local
      // avec les adresses fraîchement écrites dans Supabase avant de changer de page.
      await update();

      // Redirection logicielle fluide vers l'étape suivante
      router.push(`/${locale}/account/onboarding/preferences`);

    } catch (err) {
      setLoading(false);
      toast.error("Une erreur technique est survenue lors de l'enregistrement.");
    }
  }

  const handleBillingChange = (field: keyof typeof billing) => 
    (e: ChangeEvent<HTMLInputElement>) =>
      setBilling({ ...billing, [field]: e.target.value });

  const handleShippingChange = (field: keyof typeof shipping) => 
    (e: ChangeEvent<HTMLInputElement>) =>
      setShipping({ ...shipping, [field]: e.target.value });

  return (
    <div className="max-w-md mx-auto py-10 px-4 text-black">
      <OnboardingProgress step={2} />

      <h1 className="text-3xl font-bold mb-6 text-gray-900">Adresse de facturation</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
            placeholder="Rue *"
            value={billing.street}
            onChange={handleBillingChange("street")}
            required
          />
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
            placeholder="Numéro"
            value={billing.number}
            onChange={handleBillingChange("number")}
          />
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
            placeholder="Code postal *"
            value={billing.zip}
            onChange={handleBillingChange("zip")}
            required
          />
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
            placeholder="Ville *"
            value={billing.city}
            onChange={handleBillingChange("city")}
            required
          />
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
            placeholder="Pays *"
            value={billing.country}
            onChange={handleBillingChange("country")}
            required
          />
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
            placeholder="Téléphone"
            value={billing.phone}
            onChange={handleBillingChange("phone")}
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="diffShipping"
            checked={useDifferentShipping}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUseDifferentShipping(e.target.checked)
            }
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="diffShipping" className="text-sm font-medium text-gray-700 select-none">
            Adresse de livraison différente ?
          </label>
        </div>

        {useDifferentShipping && (
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900">Adresse de livraison</h2>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
              placeholder="Rue *"
              value={shipping.street}
              onChange={handleShippingChange("street")}
              required
            />
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
              placeholder="Numéro"
              value={shipping.number}
              onChange={handleShippingChange("number")}
            />
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
              placeholder="Code postal *"
              value={shipping.zip}
              onChange={handleShippingChange("zip")}
              required
            />
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
              placeholder="Ville *"
              value={shipping.city}
              onChange={handleShippingChange("city")}
              required
            />
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
              placeholder="Pays *"
              value={shipping.country}
              onChange={handleShippingChange("country")}
              required
            />
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
              placeholder="Téléphone"
              value={shipping.phone}
              onChange={handleShippingChange("phone")}
            />
          </div>
        )}

        <button 
          className="w-full px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 disabled:bg-gray-400 transition text-sm font-medium" 
          type="submit"
          disabled={loading}
        >
          {loading ? "Enregistrement en cours..." : "Continuer"}
        </button>
      </form>
    </div>
  );
}
