"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ImageUploader from "@/components/ImageUploader";
import { QRCodeCanvas } from "qrcode.react";
import Toast from "../../../components/Toast";

export default function NewProductPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  /* ------------------------------------------------------ */
  /* ÉTAT PRODUIT                                            */
  /* ------------------------------------------------------ */
  const [product, setProduct] = useState({
    name: "",
    description: "",
    prix_normal: "",
    prix_locaplux: "",
    prix_achat: "",
    stock: "",
    damage_type: "no_damage",
    damage_description: "",
    images: [],
    categoryId: null,

    // 🟦 NOUVEAU : options produit
    pickup_available: true,
    delivery_available: false,
  });

  /* ------------------------------------------------------ */
  /* CHARGEMENT PARAMÈTRES PARTENAIRE                        */
  /* ------------------------------------------------------ */
  const [partner, setPartner] = useState(null);

  useEffect(() => {
    async function loadPartner() {
      const res = await fetch("/api/partner/account");
      const data = await res.json();

      setPartner(data);

      // Pré-remplissage automatique
      setProduct((prev) => ({
        ...prev,
        pickup_available: data.default_pickup_available ?? true,
        delivery_available: data.default_delivery_available ?? false,
      }));
    }

    loadPartner();
  }, []);

  /* ------------------------------------------------------ */
  /* AUTO-DETECTION IA TEXTE                                */
  /* ------------------------------------------------------ */
  const [autoCategory, setAutoCategory] = useState(null);
  const [debug, setDebug] = useState(null);

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

  /* ------------------------------------------------------ */
  /* UPLOAD DESKTOP                                         */
  /* ------------------------------------------------------ */
  function handleUpload(img) {
    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, img.url],
    }));

    if (img.autoCategory) {
      setAutoCategory(img.autoCategory);
      setProduct((prev) => ({
        ...prev,
        categoryId: img.autoCategory.id,
      }));
    }

    if (img.debug) setDebug(img.debug);
  }

  function handleDelete(url) {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((i) => i !== url),
    }));
  }

  /* ------------------------------------------------------ */
  /* MOBILE UPLOAD                                          */
  /* ------------------------------------------------------ */
  const [mobileSession, setMobileSession] = useState(null);

  function generateMobileSession() {
    const id = crypto.randomUUID();
    setMobileSession(id);
  }

  useEffect(() => {
    if (!mobileSession) return;

    const interval = setInterval(async () => {
      const res = await fetch(
        `/api/partner/products/mobile-upload?session=${mobileSession}`
      );

      const data = await res.json();

      if (data.url) {
        setProduct((prev) => ({
          ...prev,
          images: [...prev.images, data.url],
        }));
        setMobileSession(null);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [mobileSession]);

  /* ------------------------------------------------------ */
  /* SUBMIT                                                 */
  /* ------------------------------------------------------ */
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  async function handleSubmit(e) {
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

    setSaving(false);

    if (!res.ok) {
      setToast({ message: "Erreur lors de la création", type: "error" });
      return;
    }

    window.location.href = "/partner/products";
  }

  /* ------------------------------------------------------ */
  /* UI                                                     */
  /* ------------------------------------------------------ */
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
        {/* HEADER */}
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

            <button
              type="button"
              onClick={generateMobileSession}
              className="px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition"
            >
              Ajouter depuis mon téléphone
            </button>

            {mobileSession && (
              <div className="mt-6 p-6 bg-gray-50 dark:bg-[#1A1A1C] border border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Scannez ce QR code
                </h3>

                <div className="p-4 bg-white dark:bg-[#0F0F10] rounded-2xl border border-gray-300 dark:border-white/10 shadow-sm">
                  <QRCodeCanvas
                    value={`${window.location.origin}/partner/products/capture?session=${mobileSession}`}
                    size={200}
                  />
                </div>
              </div>
            )}
          </section>

          {/* INFORMATIONS */}
          <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Informations
            </h2>

            <div className="space-y-4">
              {/* NOM */}
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Nom
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) =>
                    setProduct({ ...product, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1C] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Description
                </label>
                <textarea
                  value={product.description}
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
                  className="w-full h-32 px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1C] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
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
              {/* RETRAIT */}
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

              {/* LIVRAISON */}
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

          {/* PRIX / STOCK / DOMMAGES */}
          <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Prix, Stock & État
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* PRIX NORMAL */}
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

              {/* PRIX LOCAPLUX */}
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

              {/* PRIX D’ACHAT */}
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

              {/* STOCK */}
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

            {/* DOMMAGES */}
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

          {/* CTA */}
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
