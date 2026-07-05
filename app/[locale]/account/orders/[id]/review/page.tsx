"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";

type OrderData = {
  id: string;
  partner: {
    id: string;
    publicName: string | null;
    company: string | null;
  };
};

export default function OrderReviewPage({ params }) {
  const { id } = params;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/account/orders/${id}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch(() => setOrder(null));
  }, [id]);

  const submitReview = async () => {
    if (!rating) {
      setError("Merci de choisir une note.");
      return;
    }

    if (!order) return;

    setLoading(true);
    setError("");

    const res = await fetch(`/api/partner/${order.partner.id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating,
        comment,
        orderId: order.id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erreur lors de l’envoi de l’avis.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (!order) {
    return (
      <Container>
        <div className="py-20 text-center opacity-70">Chargement…</div>
      </Container>
    );
  }

  const partnerName =
    order.partner.publicName ||
    order.partner.company ||
    "Partenaire Locaplux";

  return (
    <Container>
      <div className="max-w-xl mx-auto py-10 space-y-8 text-gray-900 dark:text-gray-100">

        <div>
          <h1 className="text-2xl font-semibold">Donner un avis</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Commande #{order.id} • Partenaire : {partnerName}
          </p>
        </div>

        {/* NOTE */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Votre note</p>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm transition
                  ${
                    rating && rating >= n
                      ? "bg-black text-white border-black dark:bg-white dark:text-black"
                      : "bg-white dark:bg-[#18181A] border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-200"
                  }
                `}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* COMMENTAIRE */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Votre avis (optionnel)</p>

          <textarea
            className="w-full h-32 border rounded-lg p-3 text-sm bg-white dark:bg-[#18181A] border-gray-300 dark:border-white/10 text-gray-800 dark:text-gray-100"
            placeholder="Partagez votre expérience avec ce partenaire…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={800}
          />

          <p className="text-xs text-gray-500">{comment.length}/800 caractères</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">Merci, votre avis a bien été enregistré.</p>}

        <div className="flex justify-end gap-3">
          <a
            href="/account/orders"
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-white/10"
          >
            Retour
          </a>

          <button
            onClick={submitReview}
            disabled={loading}
            className="px-5 py-2 text-sm rounded-lg bg-black text-white hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? "Envoi…" : "Envoyer l’avis"}
          </button>
        </div>
      </div>
    </Container>
  );
}
