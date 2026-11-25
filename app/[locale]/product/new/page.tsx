"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ImageUploader from "@/components/ImageUploader";
import { QRCodeCanvas } from "qrcode.react";
import Toast from "../../../components/Toast";

const BOOST_OFFERS = [
  { duration: 7, price: 29, label: "7 jours" },
  { duration: 14, price: 49, label: "14 jours" },
  { duration: 30, price: 79, label: "30 jours" },
];

export default function NewProductPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const [product, setProduct] = useState({
    name: "",
    description: "",
    prix_normal: "",
    prix_locaplux: "",
    prix_achat: "",
    stock: "",
    condition: "new",
    reason: "",
    reference: "",
    dimensions: "",
    materials: "",
    brand: "",
    damage_type: "no_damage",
    damage_description: "",
    images: [] as string[],
    categoryId: null as string | null,

    pickup_available: true,
    delivery_available: false,

    boostEnabled: false,
    boostMode: "paid" as "credit" | "paid",
    boostDuration: 7,
  });

  const [partner, setPartner] = useState<any>(null);

  useEffect(() => {
    async function loadPartner() {
      const res = await fetch("/api/partner/account");
      const data = await res.json();

      setPartner(data);

      const availableCredits = data?.freeBoostCredits ?? 0;

      setProduct((prev) => ({
        ...prev,
        pickup_available: data.default_pickup_available ?? true,
        delivery_available: data.default_delivery_available ?? false,
        boostMode: availableCredits > 0 ? "credit" : "paid",
      }));
    }

    loadPartner();
  }, []);

  const [autoCategory, setAutoCategory] = useState<any>(null);
  const [debug, setDebug] = useState<any>(null);

  useEffect(() => {
    if (!product.name && !product.description) return;

    const timeout = setTimeout(async () => {
      const res = await fetch("/api/auto-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
        }),
      });

      const data = await res.json();

      if (data.debug) setDebug(data.debug);

      if (data.categoryId) {
        setAutoCategory(data);
        setProduct((prev) => ({ ...prev, categoryId: data.categoryId }));
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [product.name, product.description]);

  function handleUpload(img: { url: string; autoCategory?: any; debug?: any }) {
    setProduct((prev) => ({
      ...prev,
      images: [...(prev.images || []), img.url],
      categoryId: img.autoCategory?.id ?? prev.categoryId,
    }));

    if (img.autoCategory) {
      setAutoCategory(img.autoCategory);
    }

    if (img.debug) {
      setDebug(img.debug);
    }
  }

  function handleDelete(url: string) {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((i) => i !== url),
    }));
  }

  const [mobileSession, setMobileSession] = useState<string | null>(null);
  const [receivedMobileUrls, setReceivedMobileUrls] = useState<string[]>([]);

  function generateMobileSession() {
    const id = crypto.randomUUID();
    setReceivedMobileUrls([]);
    setMobileSession(id);
  }

  useEffect(() => {
    if (!mobileSession) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/partner/products/mobile-upload?session=${mobileSession}`
        );
        if (!res.ok) return;

        const data = await res.json();

        const incomingUrls: string[] = Array.isArray(data.urls)
          ? data.urls
          : data.url
          ? [data.url]
          : [];

        const unseenUrls = incomingUrls.filter(
          (u) => !receivedMobileUrls.includes(u)
        );

        if (unseenUrls.length > 0) {
          setReceivedMobileUrls((prev) => [...prev, ...unseenUrls]);
          setProduct((prev) => ({
            ...prev,
            images: [...prev.images, ...unseenUrls],
          }));
        }
      } catch (err) {
        console.error("Erreur polling mobile-upload:", err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [mobileSession, receivedMobileUrls]);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<any>(null);

  const freeBoostCredits = partner?.freeBoostCredits ?? 0;
  const selectedOffer =
    BOOST_OFFERS.find((o) => o.duration === product.boostDuration) ||
    BOOST_OFFERS[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/partner/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...product,
        prix_normal: Number(product.prix_normal),
        prix_locaplux: Number(product.prix_locaplux),
        prix_achat: product.prix_achat ? Number(product.prix_achat) : null,
        stock: Number(product.stock),
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setToast({
        message: data?.error || "Erreur lors de la création",
        type: "error",
      });
      return;
    }

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
      return;
    }

    window.location.href = "/partner/products";
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0C]">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-4xl mx-auto py-12 px-4 lg:px-0 space-y-10">
        <header>
          <p className="text-xs font-medium tracking-[0.2em] text-gray-500 dark:text-gray-400 uppercase">
            Locaplux • Produit
          </p>

          <h1 className="mt-2 text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white">
            Nouveau produit
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* IMAGES */}
          <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Images du produit
            </h2>

            <ImageUploader
              images={product.images}
              onUpload={handleUpload}
              onDelete={handleDelete}
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={generateMobileSession}
                className="px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition"
              >
                Ajouter depuis mon téléphone
              </button>

              {mobileSession && (
                <button
                  type="button"
                  onClick={() => setMobileSession(null)}
                  className="px-4 py-2.5 bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-300 dark:hover:bg-white/20 transition"
                >
                  Terminer la session mobile
                </button>
              )}
            </div>

            {mobileSession && (
              <div className="mt-6 p-6 bg-gray-50 dark:bg-[#1A1A1C] border border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Scannez ce QR code avec votre iPhone ou Android
                </h3>

                <div className="p-4 bg-white dark:bg-[#0F0F10] rounded-2xl border border-gray-300 dark:border-white/10 shadow-sm">
                  <QRCodeCanvas
                    value={`${window.location.origin}/partner/products/capture?session=${mobileSession}`}
                    size={200}
                  />
                </div>

                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Vous pouvez envoyer plusieurs photos à la suite avant de fermer la session.
                </p>
              </div>
            )}
          </section>

          {/* INFORMATIONS */}
          <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Informations
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={(e) =>
                    setProduct({ ...product, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1C] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Description
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
                  className="w-full h-32 px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1C] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Pourquoi ce prix ? (optionnel)
                </label>
                <input
                  type="text"
                  name="reason"
                  placeholder="Ex. : Produit de showroom, fin de série, déstockage…"
                  value={product.reason}
                  onChange={(e) =>
                    setProduct({ ...product, reason: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1C] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </section>

          {/* CARACTÉRISTIQUES */}
          <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Caractéristiques
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Marque
                </label>
                <input
                  type="text"
                  name="brand"
                  placeholder="Ex. : Vitra, Kartell, Hay…"
                  value={product.brand}
                  onChange={(e) =>
                    setProduct({ ...product, brand: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1C] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Référence
                </label>
                <input
                  type="text"
                  name="reference"
                  placeholder="Ex. : REF-2026-01"
                  value={product.reference}
                  onChange={(e) =>
                    setProduct({ ...product, reference: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1C] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Dimensions
                </label>
                <input
                  type="text"
                  name="dimensions"
                  placeholder="Ex. : 200 × 90 × 75 cm"
                  value={product.dimensions}
                  onChange={(e) =>
                    setProduct({ ...product, dimensions: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1C] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Matériaux
                </label>
                <input
                  type="text"
                  name="materials"
                  placeholder="Ex. : Chêne massif, tissu lin"
                  value={product.materials}
                  onChange={(e) =>
                    setProduct({ ...product, materials: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1C] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </section>

          {/* CATÉGORIE IA */}
          <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Catégorie
            </h2>

            <p
              className="inline-block px-3 py-1 text-xs rounded-lg 
              bg-blue-100 text-blue-700 border border-blue-300 
              dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700"
            >
              {autoCategory
                ? `${autoCategory.category}${
                    autoCategory.parent ? " → " + autoCategory.parent : ""
                  }`
                : "En attente de détection…"}
            </p>

            {isAdmin && autoCategory && (
              <div className="mt-1 text-xs text-neutral-500 space-y-0.5">
                {autoCategory.confidence !== undefined && (
                  <div>Confiance IA : {autoCategory.confidence}%</div>
                )}
                {autoCategory.source && (
                  <div>Source : {autoCategory.source}</div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={async () => {
                const res = await fetch("/api/auto-category", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: product.name,
                    description: product.description,
                  }),
                });

                const data = await res.json();

                if (data.debug) setDebug(data.debug);

                if (data.categoryId) {
                  setAutoCategory(data);
                  setProduct((prev) => ({
                    ...prev,
                    categoryId: data.categoryId,
                  }));
                }
              }}
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition"
            >
              Re‑détecter la catégorie
            </button>
          </section>

          {/* OPTIONS RETRAIT / LIVRAISON */}
          <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Options de mise à disposition
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Retrait sur place
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Le client vient chercher le produit chez vous.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setProduct((prev) => ({
                      ...prev,
                      pickup_available: !prev.pickup_available,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    product.pickup_available ? "bg-black" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      product.pickup_available
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Livraison
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Livraison selon vos paramètres partenaires.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setProduct((prev) => ({
                      ...prev,
                      delivery_available: !prev.delivery_available,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    product.delivery_available ? "bg-black" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      product.delivery_available
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* PRIX / STOCK / ÉTAT / DOMMAGES */}
          <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Prix, Stock & État
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Prix normal (€)
                </label>
                <input
                  type="number"
                  value={product.prix_normal}
                  onChange={(e) =>
                    setProduct({ ...product, prix_normal: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1C] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Prix Locaplux (€)
                </label>
                <input
                  type="number"
                  value={product.prix_locaplux}
                  onChange={(e) =>
                    setProduct({ ...product, prix_locaplux: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1C] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Prix d’achat (optionnel)
                </label>
                <input
                  type="number"
                  value={product.prix_achat}
                  onChange={(e) =>
                    setProduct({ ...product, prix_achat: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1C] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Stock disponible
                </label>
                <input
                  type="number"
                  value={product.stock}
                  onChange={(e) =>
                    setProduct({ ...product, stock: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1C] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
                État du produit
              </label>

              <select
                value={product.condition}
                onChange={(e) =>
                  setProduct({ ...product, condition: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1C] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
              >
                <option value="new">Nouveau (new / nei)</option>
                <option value="good">Bon état</option>
                <option value="fair">État correct</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
                Type de dommage
              </label>

              <select
                value={product.damage_type}
                onChange={(e) =>
                  setProduct({ ...product, damage_type: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1C] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
              >
                <option value="no_damage">Aucun dommage</option>
                <option value="exhibition_damage">Dommage d’exposition</option>
                <option value="transport_damage">Dommage transport</option>
                <option value="stock_damage">Dommage stockage</option>
                <option value="missing_part">Pièce manquante</option>
                <option value="packaging_damage">Emballage abîmé</option>
                <option value="other">Autre dommage</option>
              </select>

              {product.damage_type !== "no_damage" && (
                <textarea
                  rows={3}
                  placeholder="Décrivez le dommage…"
                  value={product.damage_description}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      damage_description: e.target.value,
                    })
                  }
                  className="mt-3 w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1C] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
                />
              )}
            </div>
          </section>

          {/* MISE EN AVANT (OPTION PAYANTE OU CRÉDIT ADMIN) */}
          <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Mise en avant sur la page d’accueil
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Affichez ce produit dans le carrousel principal de Locaplux (une fois validé).
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setProduct((prev) => ({
                    ...prev,
                    boostEnabled: !prev.boostEnabled,
                  }))
                }
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
                  product.boostEnabled ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-black transition ${
                    product.boostEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {freeBoostCredits > 0 && (
              <div className="px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 text-xs text-amber-900 dark:text-amber-200">
                Vous disposez de <strong>{freeBoostCredits}</strong> crédit(s) de mise en avant offert(s) par l’administrateur.
              </div>
            )}

            {product.boostEnabled && (
              <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-white/10">
                {freeBoostCredits > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setProduct((prev) => ({ ...prev, boostMode: "credit" }))
                      }
                      className={`p-3 rounded-xl border text-left transition ${
                        product.boostMode === "credit"
                          ? "border-black dark:border-white bg-gray-50 dark:bg-white/10"
                          : "border-gray-200 dark:border-white/10"
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Utiliser 1 crédit offert
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Gratuit ({freeBoostCredits} restant(s))
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setProduct((prev) => ({ ...prev, boostMode: "paid" }))
                      }
                      className={`p-3 rounded-xl border text-left transition ${
                        product.boostMode === "paid"
                          ? "border-black dark:border-white bg-gray-50 dark:bg-white/10"
                          : "border-gray-200 dark:border-white/10"
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Formule payante
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        À partir de {BOOST_OFFERS[0].price} €
                      </p>
                    </button>
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                    Durée de mise en avant
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {BOOST_OFFERS.map((offer) => (
                      <button
                        key={offer.duration}
                        type="button"
                        onClick={() =>
                          setProduct((prev) => ({
                            ...prev,
                            boostDuration: offer.duration,
                          }))
                        }
                        className={`p-3 rounded-xl border text-center transition ${
                          product.boostDuration === offer.duration
                            ? "border-black dark:border-white bg-gray-50 dark:bg-white/10"
                            : "border-gray-200 dark:border-white/10"
                        }`}
                      >
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {offer.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {product.boostMode === "credit" && freeBoostCredits > 0
                            ? "0 € (crédit)"
                            : `${offer.price} €`}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {product.boostMode === "paid" && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Option payante sélectionnée : <strong>{selectedOffer.price} €</strong> pour {selectedOffer.label}.
                  </p>
                )}
              </div>
            )}
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition disabled:opacity-50"
            >
              {saving ? "Création…" : "Créer le produit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}