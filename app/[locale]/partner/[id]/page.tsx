"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PartnerSkeleton from "./PartnerSkeleton";

/* -------------------------------------------------------
   TYPES
------------------------------------------------------- */
type PublicPartner = {
  id: string;
  publicName: string | null;
  company: string | null;
  city: string | null;
  country: string | null;
  description: string | null;
  avatar: string | null;
  bannerUrl: string | null;
  createdAt: string;
  status: string;
  averageResponseTime?: number | null; // en minutes
};

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

/* -------------------------------------------------------
   PAGE PARTENAIRE
------------------------------------------------------- */
export default function PublicPartnerPage() {
  const { id } = useParams();
  const [partner, setPartner] = useState<PublicPartner | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------------
     CHARGEMENT PARTENAIRE + AVIS
  ------------------------------------------------------- */
  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const partnerRes = await fetch(`/api/public/partner/${id}`);
        const partnerData = await partnerRes.json();
        setPartner(partnerData);

        const reviewRes = await fetch(`/api/partner/${id}/reviews`);
        const reviewData = await reviewRes.json();

        setReviews(reviewData.reviews || []);
        setAverage(reviewData.averageRating);
        setCount(reviewData.count);
      } catch (err) {
        console.error("Erreur chargement partenaire :", err);
      }

      setLoading(false);
    }

    load();
  }, [id]);

  /* -------------------------------------------------------
     SKELETON
  ------------------------------------------------------- */
  if (loading) return <PartnerSkeleton />;

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B0B0C]">
        <div className="bg-white/80 dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-5 shadow-sm">
          <p className="text-sm text-gray-700 dark:text-gray-200">
            Partenaire introuvable ou non disponible publiquement.
          </p>
        </div>
      </div>
    );
  }

  const displayName =
    partner.publicName || partner.company || "Partenaire Locaplux";

  const created = new Date(partner.createdAt);
  const memberSince = created.getFullYear();

  /* -------------------------------------------------------
     BADGES PREMIUM
  ------------------------------------------------------- */

  // TOP PARTENAIRE
  const isTopPartner = average !== null && count >= 5 && average >= 4.5;

  // NOUVEAU PARTENAIRE (< 30 jours)
  const daysSinceCreation =
    (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
  const isNewPartner = daysSinceCreation < 30;

  // TRÈS RÉACTIF (< 2h)
  const averageResponseTime = partner.averageResponseTime ?? null;
  const isVeryResponsive =
    averageResponseTime !== null && averageResponseTime <= 120;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0C] text-gray-900 dark:text-white">

      {/* BANNIÈRE */}
      <div className="w-full h-56 md:h-72 overflow-hidden">
        {partner.bannerUrl ? (
          <img
            src={partner.bannerUrl}
            alt={`Bannière de ${displayName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-[#141416] dark:to-[#1F1F22] flex items-center justify-center">
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              Aucune bannière pour le moment
            </span>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-16 pb-16 space-y-10">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#1A1A1C] border border-white/70 dark:border-white/10 shadow-md">
            {partner.avatar ? (
              <img
                src={partner.avatar}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">
                Aucun visuel
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                {displayName}
              </h1>

              {/* BADGE PARTENAIRE VÉRIFIÉ */}
              {["approved", "active"].includes(partner.status) && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-3 py-1 text-xs font-medium border border-emerald-100 dark:border-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Partenaire vérifié
                </span>
              )}

              {/* BADGE TOP PARTENAIRE */}
              {isTopPartner && (
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-3 py-1 text-xs font-medium border border-yellow-200 dark:border-yellow-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                  Top partenaire
                </span>
              )}

              {/* BADGE NOUVEAU PARTENAIRE */}
              {isNewPartner && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 text-xs font-medium border border-blue-200 dark:border-blue-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Nouveau partenaire
                </span>
              )}

              {/* BADGE TRÈS RÉACTIF */}
              {isVeryResponsive && (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 text-xs font-medium border border-purple-200 dark:border-purple-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  Très réactif
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              {partner.city && partner.country && (
                <span>
                  Basé à {partner.city}, {partner.country}
                </span>
              )}
              <span className="h-1 w-1 rounded-full bg-gray-400/60" />
              <span>Membre depuis {memberSince}</span>
            </div>
          </div>
        </header>

        {/* -------------------------------------------------------
           CONTENU PRINCIPAL
        ------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] gap-8">

          {/* COLONNE GAUCHE */}
          <div className="space-y-6">

            {/* À PROPOS */}
            <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">À propos</h2>
              <p className="text-sm md:text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {partner.description ||
                  "Ce partenaire n’a pas encore ajouté de description détaillée."}
              </p>
            </section>

            {/* AVIS */}
            <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">Avis des acheteurs</h2>

              {average !== null && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Note moyenne : {average.toFixed(1)} / 5 ({count} avis)
                </p>
              )}

              {/* HISTOGRAMME PREMIUM */}
              {count > 0 && (
                <div className="space-y-3 mt-4">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const total = reviews.length;
                    const countForStar = reviews.filter((r) => r.rating === star).length;
                    const percentage = total > 0 ? (countForStar / total) * 100 : 0;

                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="w-6 text-sm font-medium">{star}★</span>

                        <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-black dark:bg-white transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <span className="w-10 text-right text-sm text-gray-600 dark:text-gray-400">
                          {countForStar}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* LISTE DES AVIS */}
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aucun avis pour le moment.
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div
                      key={r.id}
                      className="border border-gray-200 dark:border-white/10 rounded-xl p-4 bg-white dark:bg-[#18181A] shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {r.rating} / 5
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(r.created_at).toLocaleDateString("fr-FR")}
                        </span>
                      </div>

                      {r.comment && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {r.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>

          {/* COLONNE DROITE */}
          <aside className="space-y-6">

            {/* CONTACT */}
            <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">
                Contacter le partenaire
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Toutes les communications passent par Locaplux pour garantir la
                sécurité des échanges.
              </p>

              <Link
                href={`/messages/start?partner=${partner.id}`}
                className="inline-flex items-center justify-center w-full px-5 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition"
              >
                Envoyer un message
              </Link>
            </section>

            {/* SÉCURITÉ */}
            <section className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm text-xs text-gray-500 dark:text-gray-400 space-y-2">
              <p>
                Les coordonnées directes ne sont pas affichées pour garantir la
                sécurité des partenaires et des acheteurs.
              </p>
            </section>

          </aside>
        </div>
      </div>
    </div>
  );
}
