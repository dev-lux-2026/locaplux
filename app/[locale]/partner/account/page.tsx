"use client";

import { useEffect, useState } from "react";
import Toast from "@/app/components/Toast";

export default function PartnerAccountPage() {
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<any>(null);

  useEffect(() => {
    fetch("/api/partner/account")
      .then((res) => res.json())
      .then((data) => {
        setPartner(data);
        setLoading(false);
      });
  }, []);

  async function save() {
    setSaving(true);

    const payload = {
      ...partner,
      // normalisation simple côté client
      delivery_price_per_km:
        partner.delivery_price_per_km !== undefined &&
        partner.delivery_price_per_km !== null &&
        partner.delivery_price_per_km !== ""
          ? Number(partner.delivery_price_per_km)
          : null,
      delivery_min_price:
        partner.delivery_min_price !== undefined &&
        partner.delivery_min_price !== null &&
        partner.delivery_min_price !== ""
          ? Number(partner.delivery_min_price)
          : null,
      delivery_max_price:
        partner.delivery_max_price !== undefined &&
        partner.delivery_max_price !== null &&
        partner.delivery_max_price !== ""
          ? Number(partner.delivery_max_price)
          : null,
      delivery_max_km:
        partner.delivery_max_km !== undefined &&
        partner.delivery_max_km !== null &&
        partner.delivery_max_km !== ""
          ? Number(partner.delivery_max_km)
          : null,
      delivery_allowed_countries:
        typeof partner.delivery_allowed_countries === "string"
          ? partner.delivery_allowed_countries
              .split(",")
              .map((c: string) => c.trim())
              .filter((c: string) => c.length > 0)
          : partner.delivery_allowed_countries ?? [],
      default_pickup_available:
        partner.default_pickup_available === undefined
          ? true
          : Boolean(partner.default_pickup_available),
      default_delivery_available:
        partner.default_delivery_available === undefined
          ? true
          : Boolean(partner.default_delivery_available),
    };

    const res = await fetch("/api/partner/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setToast({ message: "Informations mises à jour", type: "success" });
    } else {
      setToast({ message: "Erreur lors de la sauvegarde", type: "error" });
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Chargement du compte…
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Erreur : partenaire introuvable.
      </div>
    );
  }

  // pour l’input texte des pays, on affiche une version jointe
  const deliveryCountriesText =
    typeof partner.delivery_allowed_countries === "string"
      ? partner.delivery_allowed_countries
      : Array.isArray(partner.delivery_allowed_countries)
      ? partner.delivery_allowed_countries.join(", ")
      : "";

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-3xl mx-auto py-12 px-4 lg:px-0 space-y-10">
        {/* HEADER */}
        <header>
          <p className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase">
            Locaplux • Compte
          </p>

          <h1 className="mt-2 text-3xl lg:text-4xl font-semibold text-gray-900">
            Mon compte partenaire
          </h1>

          <p className="mt-3 text-sm text-gray-600 max-w-2xl">
            Gérez les informations de votre compte professionnel. Ces données
            apparaissent sur vos produits, vos messages et vos factures.
          </p>
        </header>

        {/* SECTION — Identité */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Identité</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-black"
              placeholder="Prénom"
              value={partner.firstName || ""}
              onChange={(e) =>
                setPartner({ ...partner, firstName: e.target.value })
              }
            />

            <input
              className="border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-black"
              placeholder="Nom"
              value={partner.lastName || ""}
              onChange={(e) =>
                setPartner({ ...partner, lastName: e.target.value })
              }
            />
          </div>
        </section>

        {/* SECTION — Entreprise */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Entreprise</h2>

          <input
            className="border border-gray-300 p-2.5 rounded-lg w-full text-sm"
            placeholder="Nom public"
            value={partner.publicName || ""}
            onChange={(e) =>
              setPartner({ ...partner, publicName: e.target.value })
            }
          />

          <input
            className="border border-gray-300 p-2.5 rounded-lg w-full text-sm"
            placeholder="Entreprise"
            value={partner.company || ""}
            onChange={(e) =>
              setPartner({ ...partner, company: e.target.value })
            }
          />

          <input
            className="border border-gray-300 p-2.5 rounded-lg w-full text-sm"
            placeholder="TVA"
            value={partner.vat || ""}
            onChange={(e) => setPartner({ ...partner, vat: e.target.value })}
          />
        </section>

        {/* SECTION — Contact */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Contact</h2>

          <div className="grid grid-cols-3 gap-4">
            <input
              className="border border-gray-300 p-2.5 rounded-lg text-sm"
              placeholder="+352"
              value={partner.phonePrefix || ""}
              onChange={(e) =>
                setPartner({ ...partner, phonePrefix: e.target.value })
              }
            />

            <input
              className="border border-gray-300 p-2.5 rounded-lg col-span-2 text-sm"
              placeholder="Numéro de téléphone"
              value={partner.phone || ""}
              onChange={(e) =>
                setPartner({ ...partner, phone: e.target.value })
              }
            />
          </div>

          <input
            className="border border-gray-300 p-2.5 rounded-lg w-full text-sm"
            placeholder="Site web"
            value={partner.website || ""}
            onChange={(e) =>
              setPartner({ ...partner, website: e.target.value })
            }
          />
        </section>

        {/* SECTION — Adresse */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Adresse</h2>

          <input
            className="border border-gray-300 p-2.5 rounded-lg w-full text-sm"
            placeholder="Rue"
            value={partner.street || ""}
            onChange={(e) =>
              setPartner({ ...partner, street: e.target.value })
            }
          />

          <div className="grid grid-cols-3 gap-4">
            <input
              className="border border-gray-300 p-2.5 rounded-lg text-sm"
              placeholder="Numéro"
              value={partner.number || ""}
              onChange={(e) =>
                setPartner({ ...partner, number: e.target.value })
              }
            />

            <input
              className="border border-gray-300 p-2.5 rounded-lg text-sm"
              placeholder="Code postal"
              value={partner.postal || ""}
              onChange={(e) =>
                setPartner({ ...partner, postal: e.target.value })
              }
            />

            <input
              className="border border-gray-300 p-2.5 rounded-lg text-sm"
              placeholder="Ville"
              value={partner.city || ""}
              onChange={(e) =>
                setPartner({ ...partner, city: e.target.value })
              }
            />
          </div>

          <input
            className="border border-gray-300 p-2.5 rounded-lg w-full text-sm"
            placeholder="Pays"
            value={partner.country || ""}
            onChange={(e) =>
              setPartner({ ...partner, country: e.target.value })
            }
          />
        </section>

        {/* SECTION — Paramètres de livraison */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Paramètres de livraison
            </h2>
            <p className="text-xs text-gray-500 max-w-xs text-right">
              Ces paramètres s&apos;appliquent à tous vos produits pour lesquels
              vous activez la livraison. Vous pouvez ensuite activer/désactiver
              la livraison produit par produit.
            </p>
          </div>

          {/* Tarifs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Prix par km (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="border border-gray-300 p-2.5 rounded-lg w-full text-sm"
                placeholder="Ex : 0.50"
                value={partner.delivery_price_per_km ?? ""}
                onChange={(e) =>
                  setPartner({
                    ...partner,
                    delivery_price_per_km: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Prix minimum (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="border border-gray-300 p-2.5 rounded-lg w-full text-sm"
                placeholder="Ex : 5"
                value={partner.delivery_min_price ?? ""}
                onChange={(e) =>
                  setPartner({
                    ...partner,
                    delivery_min_price: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Prix maximum (€) (optionnel)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="border border-gray-300 p-2.5 rounded-lg w-full text-sm"
                placeholder="Ex : 40"
                value={partner.delivery_max_price ?? ""}
                onChange={(e) =>
                  setPartner({
                    ...partner,
                    delivery_max_price: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Distance & pays */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Distance maximale (km)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                className="border border-gray-300 p-2.5 rounded-lg w-full text-sm"
                placeholder="Ex : 30"
                value={partner.delivery_max_km ?? ""}
                onChange={(e) =>
                  setPartner({
                    ...partner,
                    delivery_max_km: e.target.value,
                  })
                }
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Au-delà de cette distance, le client pourra vous envoyer une
                demande de livraison spéciale.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Pays autorisés pour la livraison
              </label>
              <input
                className="border border-gray-300 p-2.5 rounded-lg w-full text-sm"
                placeholder="Ex : LU, BE, FR"
                value={deliveryCountriesText}
                onChange={(e) =>
                  setPartner({
                    ...partner,
                    delivery_allowed_countries: e.target.value,
                  })
                }
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Indiquez les codes pays (ISO 2 lettres), séparés par des
                virgules. Exemple : LU, BE, FR.
              </p>
            </div>
          </div>

          {/* Options par défaut */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Retrait sur place activé par défaut
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  S&apos;applique à chaque nouveau produit. Vous pourrez
                  modifier cela produit par produit.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setPartner({
                    ...partner,
                    default_pickup_available: !partner.default_pickup_available,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  partner.default_pickup_available ? "bg-black" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    partner.default_pickup_available
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Livraison activée par défaut
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  S&apos;applique à chaque nouveau produit. Vous pourrez
                  désactiver la livraison pour certains produits.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setPartner({
                    ...partner,
                    default_delivery_available:
                      !partner.default_delivery_available,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  partner.default_delivery_available ? "bg-black" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    partner.default_delivery_available
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* ACTIONS */}
        <div className="flex justify-end">
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition disabled:opacity-50"
          >
            {saving ? "Enregistrement…" : "Enregistrer les modifications"}
          </button>
        </div>
      </div>
    </div>
  );
}
