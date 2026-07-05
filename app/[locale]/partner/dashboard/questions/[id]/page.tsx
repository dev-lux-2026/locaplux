"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PartnerMessageDetail() {
  const { id } = useParams();
  const [message, setMessage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`/api/questions/partner?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMessage(data);
        setLoading(false);
      });
  }, [id]);

  async function sendAnswer() {
    if (!answer.trim()) return;

    setSending(true);

    const res = await fetch("/api/questions/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: id, answer }),
    });

    const data = await res.json();
    setSending(false);

    if (data.success) {
      setMessage({ ...message, answer, answeredAt: new Date() });
      setAnswer("");
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-4">Message</h1>
        <p className="text-gray-600">Chargement…</p>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-4">Message introuvable</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      <h1 className="text-3xl font-bold">Conversation</h1>

      {/* Infos produit */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Produit concerné</h2>
        <Link
          href={`/partner/products/${message.productId}`}
          className="text-blue-600 hover:underline"
        >
          {message.product.name}
        </Link>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
        <h2 className="text-xl font-semibold mb-4">Échanges</h2>

        {/* Message client */}
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div>
            <p className="font-semibold">
              {message.buyer.firstName || message.buyer.name || "Client"}
            </p>
            <p className="text-gray-700 bg-gray-100 p-3 rounded-xl mt-1 max-w-lg">
              {message.message}
            </p>

            {message.files?.length > 0 && (
              <div className="mt-2 space-y-1">
                {message.files.map((f: any) => (
                  <a
                    key={f.id}
                    href={f.url}
                    target="_blank"
                    className="text-blue-600 text-sm underline"
                  >
                    Fichier joint
                  </a>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-1">
              {new Date(message.createdAt).toLocaleString("fr-FR")}
            </p>
          </div>
        </div>

        {/* Réponse partenaire */}
        {message.answer && (
          <div className="flex gap-4 justify-end">
            <div className="text-right">
              <p className="font-semibold">Vous</p>
              <p className="text-gray-700 bg-blue-100 p-3 rounded-xl mt-1 max-w-lg inline-block">
                {message.answer}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(message.answeredAt).toLocaleString("fr-FR")}
              </p>
            </div>
            <div className="w-10 h-10 bg-gray-800 rounded-full" />
          </div>
        )}
      </div>

      {/* Formulaire de réponse */}
      {!message.answer && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Répondre</h2>

          <textarea
            className="w-full border border-gray-300 rounded-xl p-3 h-32"
            placeholder="Votre réponse…"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button
            onClick={sendAnswer}
            disabled={sending}
            className="mt-3 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-50"
          >
            {sending ? "Envoi…" : "Envoyer la réponse"}
          </button>
        </div>
      )}
    </div>
  );
}
