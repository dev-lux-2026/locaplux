"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import { detectForbiddenContent } from "@/utils/messageFilterClient";
import DeliveryPriceCalculator from "@/components/DeliveryPriceCalculator";

export default function ProductPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const { id } = params;

  const [product, setProduct] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [unlocked, setUnlocked] = useState(false);
  const [partnerInfo, setPartnerInfo] = useState<any>(null);

  /* ------------------------------------------------------ */
  /* LOAD PRODUCT                                           */
  /* ------------------------------------------------------ */
  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  /* ------------------------------------------------------ */
  /* LOAD SIMILAR PRODUCTS                                  */
  /* ------------------------------------------------------ */
  useEffect(() => {
    fetch(`/api/products/similar?id=${id}`)
      .then((res) => res.json())
      .then((data) => setSimilar(data));
  }, [id]);

  /* ------------------------------------------------------ */
  /* CHECK IF PARTNER IS UNLOCKED                           */
  /* ------------------------------------------------------ */
  useEffect(() => {
    fetch("/api/questions/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.unlocked) {
          setUnlocked(true);
          setPartnerInfo(data.partner);
        }
      });
  }, [id]);

  if (!product) {
    return (
      <Container>
        <div className="py-20 text-center opacity-70">Chargement...</div>
      </Container>
    );
  }

  /* ------------------------------------------------------ */
  /* START CHECKOUT                                         */
  /* ------------------------------------------------------ */
  async function startCheckout() {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      const clientLat = pos.coords.latitude;
      const clientLng = pos.coords.longitude;

      const cart = [
        {
          id: product.id,
          name: product.name,
          price: product.prix_locaplux,
          images: product.images || [],
          quantity: 1,
        },
      ];

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          clientLat,
          clientLng,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erreur lors du checkout");
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      alert("Impossible de récupérer votre position.");
    }
  }

  /* ------------------------------------------------------ */
  /* SEND QUESTION                                           */
  /* ------------------------------------------------------ */
  const sendQuestion = async () => {
    if (!message.trim()) {
      setError("Veuillez écrire un message.");
      return;
    }

    if (!unlocked && detectForbiddenContent(message)) {
      setError(
        "Votre message contient des informations interdites avant la livraison."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      let res;

      if (unlocked) {
        const formData = new FormData();
        formData.append("productId", product.id);
        formData.append("message", message);

        if (files) {
          Array.from(files).forEach((file) => {
            formData.append("files", file);
          });
        }

        res = await fetch("/api/questions/send", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("/api/questions/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            message,
          }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l’envoi.");
        setLoading(false);
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        setShowModal(false);
        setMessage("");
        setFiles(null);
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError("Erreur serveur.");
    }

    setLoading(false);
  };

  /* ------------------------------------------------------ */
  /* UI                                                     */
  /* ------------------------------------------------------ */
  return (
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-10">

        {/* GALERIE PREMIUM */}
        <div className="space-y-4">
          <div className="w-full h-96 bg-gray-100 dark:bg-[#1F1F22] rounded-2xl overflow-hidden shadow-sm">
            <img
              src={product.images?.[0] || "/placeholder.jpg"}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {product.images?.map((img: string, i: number) => (
              <div
                key={i}
                className="h-20 bg-gray-100 dark:bg-[#1F1F22] rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition"
              >
                <img src={img} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* INFO PRODUIT PREMIUM */}
        <div className="space-y-6">

          {/* TITRE + PRIX */}
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-2">
              <p className="text-2xl font-bold text-black dark:text-[#D4AF37]">
                {product.prix_locaplux} €
              </p>

              {product.prix_normal && (
                <p className="text-lg line-through text-gray-500 dark:text-gray-400">
                  {product.prix_normal} €
                </p>
              )}
            </div>
          </div>

          {/* RETRAIT / LIVRAISON */}
          <div className="flex gap-3 mt-2">
            {product.pickup_available && (
              <span className="px-3 py-1 text-xs rounded-lg bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">
                Retrait disponible
              </span>
            )}

            {product.delivery_available && (
              <span className="px-3 py-1 text-xs rounded-lg bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700">
                Livraison disponible
              </span>
            )}
          </div>

          {/* LIVRAISON DYNAMIQUE */}
          {product.delivery_available && (
            <DeliveryPriceCalculator productId={product.id} />
          )}

          {/* ÉTAT */}
          <div className="bg-white dark:bg-[#18181A] border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">État du produit</h3>
            <p className="text-gray-700 dark:text-gray-300">{product.condition || "Non spécifié"}</p>
          </div>

          {/* POURQUOI CE PRIX */}
          <div className="bg-white dark:bg-[#18181A] border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Pourquoi ce prix ?</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {product.reason ||
                "Produit issu d’un showroom, d’un fond de stock ou d’une fin de série."}
            </p>
          </div>

          {/* LIVRAISON (statique) */}
          <div className="bg-white dark:bg-[#18181A] border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Livraison</h3>
            <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
              <li>• Livraison estimée : 2–4 jours ouvrés</li>
              <li>• Emballage sécurisé</li>
              <li>• Suivi fourni</li>
            </ul>
          </div>

          {/* CARACTÉRISTIQUES */}
          <div className="bg-white dark:bg-[#18181A] border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Caractéristiques</h3>

            <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-2">
              <li><strong>Référence :</strong> {product.reference || "Non spécifiée"}</li>
              <li><strong>Catégorie :</strong> {product.category?.name}</li>
              <li><strong>Dimensions :</strong> {product.dimensions || "Non spécifiées"}</li>
              <li><strong>Matériaux :</strong> {product.materials || "Non spécifiés"}</li>
            </ul>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
          </div>

          {/* BLOC DE CONFIANCE */}
          <div className="bg-gray-50 dark:bg-[#18181A] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <p>✔ Produits showroom authentiques</p>
            <p>✔ Prix exceptionnels</p>
            <p>✔ Partenaires professionnels</p>
            <p>✔ Paiement sécurisé</p>
            <p>✔ Stock limité</p>
          </div>

          {/* CTA */}
          <div className="flex gap-4">
            <button
              className="flex-1 px-6 py-3 bg-black text-white rounded-xl shadow hover:bg-gray-900 transition"
              onClick={startCheckout}
            >
              Ajouter au panier
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 border border-gray-300 dark:border-white/10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition"
            >
              Contacter le partenaire
            </button>
          </div>
        </div>
      </div>

      {/* MODAL QUESTION PREMIUM */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#18181A] rounded-xl p-6 w-full max-w-md shadow-xl animate-scaleIn">

            {!success ? (
              <>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Poser une question
                </h2>

                {/* TEXTAREA + COMPTEUR */}
                <div className="relative">
                  <textarea
                    className={`w-full h-32 border rounded-lg p-3 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-[#1F1F22] focus:outline-none focus:ring-2 ${
                      !unlocked && detectForbiddenContent(message)
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-black dark:focus:ring-white"
                    }`}
                    placeholder="Votre question sur ce produit..."
                    value={message}
                    maxLength={500}
                    onChange={(e) => {
                      const value = e.target.value;
                      setMessage(value);

                      if (!unlocked && detectForbiddenContent(value)) {
                        setError(
                          "Certaines informations (email, numéro, adresse…) ne peuvent pas être envoyées avant la livraison."
                        );
                      } else {
                        setError("");
                      }
                    }}
                  />

                  <div
                    className={`absolute bottom-2 right-3 text-xs ${
                      message.length > 450 ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    {message.length}/500
                  </div>
                </div>

                {/* UPLOAD FICHIERS */}
                {unlocked && (
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                    className="mt-3 text-sm"
                  />
                )}

                {/* ERREUR */}
                {error && (
                  <p className="text-red-600 text-sm mt-2">{error}</p>
                )}

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg border dark:border-white/10"
                  >
                    Annuler
                  </button>

                  <button
                    onClick={sendQuestion}
                    disabled={
                      loading ||
                      (!unlocked && detectForbiddenContent(message))
                    }
                    className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900 transition disabled:opacity-50"
                  >
                    {loading ? "Envoi..." : "Envoyer"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-green-600 font-medium">
                  Votre question a été envoyée !
                </p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* PRODUITS SIMILAIRES */}
      <div className="mt-20">
        <h2 className="text-2xl font-semibold mb-6">Produits similaires</h2>

        {similar.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Aucun produit similaire.
          </p>
        ) : (
          <div
            className="
              grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
              gap-6
            "
          >
            {similar.map((p: any) => (
              <a
                key={p.id}
                href={`/products/${p.id}`}
                className="
                  border border-gray-200 dark:border-white/10 
                  rounded-xl p-4 shadow-sm 
                  bg-white dark:bg-[#18181A] 
                  hover:shadow-xl hover:-translate-y-1 dark:hover:bg-white/5 
                  transition cursor-pointer
                "
              >
                <img
                  src={p.images?.[0] || "/placeholder.jpg"}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />

                <p className="font-semibold text-black dark:text-white text-sm">
                  {p.name}
                </p>

                <p className="text-[#1A3A5F] dark:text-[#D4AF37] font-semibold mt-3 text-sm">
                  {p.prix_locaplux} €
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
