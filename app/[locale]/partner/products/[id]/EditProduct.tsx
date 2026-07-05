"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePartnerMode } from "@/lib/context/PartnerModeContext";
import Toast from "@/components/Toast";
import ImageUploader from "@/components/ImageUploader";
import { QRCodeCanvas } from "qrcode.react";

export default function EditProduct({ id }: { id: string }) {
  const router = useRouter();
  const { locale } = useParams(); // ← locale dynamique
  const { readOnly } = usePartnerMode();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [mobileSession, setMobileSession] = useState<string | null>(null);
  const [toast, setToast] = useState<any>(null);
  const [autoCategory, setAutoCategory] = useState<any>(null);

  /* ------------------------------------------------------ */
  /* LOAD PRODUCT                                           */
  /* ------------------------------------------------------ */
  useEffect(() => {
    fetch(`/api/partner/products/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setProduct({
          ...data,
          prix_normal: data.prix_normal?.toString() || "",
          prix_locaplux: data.prix_locaplux?.toString() || "",
          prix_achat: data.prix_achat?.toString() || "",
          stock: data.stock?.toString() || "",
          damage_description: data.damage_description || "",
          images: data.images || [],
          categoryId: data.categoryId || null,

          pickup_available:
            typeof data.pickup_available === "boolean"
              ? data.pickup_available
              : true,
          delivery_available:
            typeof data.delivery_available === "boolean"
              ? data.delivery_available
              : false,
        });

        setAutoCategory({
          category: data.category?.name || "Sans catégorie",
        });

        setLoading(false);
      })
      .catch(() => {
        setToast({ message: "Erreur lors du chargement", type: "error" });
        setLoading(false);
      });
  }, [id]);

  /* ------------------------------------------------------ */
  /* IMAGE UPLOAD                                           */
  /* ------------------------------------------------------ */
  async function handleUpload(img: any) {
    if (readOnly) return;

    setProduct((prev: any) => ({
      ...prev,
      images: [...prev.images, img.url],
    }));

    if (img.autoCategory) {
      setAutoCategory(img.autoCategory);
      setProduct((prev: any) => ({
        ...prev,
        categoryId: img.autoCategory.id,
      }));
    }

    setToast({ message: "Image ajoutée", type: "success" });
  }

  function handleDelete(url: string) {
    if (readOnly) return;

    setProduct((prev: any) => ({
      ...prev,
      images: prev.images.filter((img: string) => img !== url),
    }));
  }

  /* ------------------------------------------------------ */
  /* MOBILE UPLOAD                                          */
  /* ------------------------------------------------------ */
  function generateMobileSession() {
    if (readOnly) return;
    const id = crypto.randomUUID();
    setMobileSession(id);
  }

  useEffect(() => {
    if (!mobileSession) return;

    const interval = setInterval(async () => {
      const res = await fetch(
        `/api/partner/products/mobile-upload?session=${mobileSession}`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (data.url) {
        setProduct((prev: any) => ({
          ...prev,
          images: [...prev.images, data.url],
        }));
        setMobileSession(null);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [mobileSession]);

  /* ------------------------------------------------------ */
  /* IA — REDETECT CATEGORY                                 */
  /* ------------------------------------------------------ */
  async function redetectCategory() {
    if (!product) return;

    const res = await fetch("/api/auto-category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: product.name,
        description: product.description,
      }),
    });

    const data = await res.json();

    if (data.categoryId) {
      setAutoCategory(data);
      setProduct((prev: any) => ({
        ...prev,
        categoryId: data.categoryId,
      }));

      setToast({
        message: `Catégorie détectée : ${data.category}`,
        type: "success",
      });
    }
  }

  /* ------------------------------------------------------ */
  /* SUBMIT PATCH                                           */
  /* ------------------------------------------------------ */
  async function handleSubmit(e: any) {
    e.preventDefault();
    if (readOnly || !product) return;

    setSaving(true);

    const res = await fetch(`/api/partner/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: product.name,
        description: product.description,
        prix_normal: Number(product.prix_normal),
        prix_locaplux: Number(product.prix_locaplux),
        prix_achat: product.prix_achat ? Number(product.prix_achat) : null,
        stock: Number(product.stock),
        images: product.images,
        damage_type: product.damage_type,
        damage_description: product.damage_description || null,
        categoryId: product.categoryId,
        pickup_available: product.pickup_available,
        delivery_available: product.delivery_available,
      }),
    });

    setSaving(false);

    if (res.ok) {
      router.push(`/${locale}/partner/products`);
    } else {
      setToast({ message: "Erreur lors de la sauvegarde", type: "error" });
    }
  }

  /* ------------------------------------------------------ */
  /* UI                                                     */
  /* ------------------------------------------------------ */
  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Chargement du produit…
      </div>
    );
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
        {/* HEADER */}
        <header>
          <p className="text-xs font-medium tracking-[0.2em] text-gray-500 dark:text-gray-400 uppercase">
            Locaplux • Produit
          </p>

          <h1 className="mt-2 text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white">
            Modifier le produit
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* IMAGES */}
          <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Images du produit
            </h2>

            <ImageUploader
              onUpload={handleUpload}
              onDelete={handleDelete}
              images={product.images}
            />

            {!readOnly && (
              <button
                type="button"
                onClick={generateMobileSession}
                className="px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition"
              >
                Ajouter depuis mon téléphone
              </button>
            )}

            {mobileSession && (
              <div className="mt-6 p-6 bg-gray-50 dark:bg-[#1A1A1C] border border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Scannez ce QR code
                </h3>

                <div className="p-4 bg-white dark:bg-[#0F0F10] rounded-2xl border border-gray-300 dark:border-white/10 shadow-sm">
                  <QRCodeCanvas
                    value={`${window.location.origin}/${locale}/partner/products/capture?session=${mobileSession}`}
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
                  disabled={readOnly}
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
                  disabled={readOnly}
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

            <p className="inline-block px-3 py-1 text-xs rounded-lg 
              bg-blue-100 text-blue-700 border border-blue-300 
              dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700">
              {autoCategory?.category || "Sans catégorie"}
            </p>

            {!readOnly && (
              <button
                type="button"
                onClick={redetectCategory}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition"
              >
                Re‑détecter la catégorie
              </button>
            )}
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
                  disabled={readOnly}
                  onClick={() =>
                    setProduct({
                      ...product,
                      pickup_available: !product.pickup_available,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    product.pickup_available ? "bg-black" : "bg-gray-300"
                  } ${readOnly ? "opacity-50 cursor-not-allowed" : ""}`}
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
                  disabled={readOnly}
                  onClick={() =>
                    setProduct({
                      ...product,
                      delivery_available: !product.delivery_available,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    product.delivery_available ? "bg-black" : "bg-gray-300"
                  } ${readOnly ? "opacity-50 cursor-not-allowed" : ""}`}
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
                  disabled={readOnly}
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
                  disabled={readOnly}
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
                  disabled={readOnly}
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
                <input                />
              </div>
            </div>
          </section>

        </form>
      </div>
    </div>
  );
}
