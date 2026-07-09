"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";

interface Question {
  id: string;
  message: string;
  answer?: string;
  product: {
    name: string;
    images?: string[];
    category?: {
      name: string;
    };
  };
}

export default function PartnerQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [answer, setAnswer] = useState("");
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/questions/partner")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(Array.isArray(data.questions) ? data.questions : []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-6 text-[#1A3A5F]">
        Questions reçues
      </h1>

      {questions.length === 0 && (
        <p className="text-gray-500">Aucune question reçue pour le moment.</p>
      )}

      <div className="space-y-6">
        {questions.map((q) => (
          <div
            key={q.id}
            className="border rounded-xl p-5 bg-white shadow-sm"
          >
            {/* Produit */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={q.product.images?.[0] || "/placeholder.jpg"}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <p className="font-semibold text-lg">{q.product.name}</p>
                <p className="text-sm text-gray-500">
                  Catégorie : {q.product.category?.name}
                </p>
              </div>
            </div>

            {/* Question */}
            <div className="mb-3">
              <p className="text-sm text-gray-500">Question du client :</p>
              <p className="font-medium">{q.message}</p>
            </div>

            {/* Réponse */}
            {q.answer ? (
              <div className="mt-4 border-t pt-4">
                <p className="text-sm text-gray-500">Votre réponse :</p>
                <p className="text-green-700 font-medium">{q.answer}</p>
              </div>
            ) : (
              <>
                {activeQuestion === q.id ? (
                  <div className="mt-4">
                    <textarea
                      className="w-full h-24 border rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A3A5F]"
                      placeholder="Votre réponse..."
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                    />

                    {error && (
                      <p className="text-red-600 text-sm mt-2">{error}</p>
                    )}

                    <div className="flex justify-end gap-3 mt-3">
                      <button
                        onClick={() => {
                          setActiveQuestion(null);
                          setAnswer("");
                          setError("");
                        }}
                        className="px-4 py-2 rounded-lg border"
                      >
                        Annuler
                      </button>

                      <button
                        onClick={async () => {
                          if (!answer.trim()) {
                            setError("Veuillez écrire une réponse.");
                            return;
                          }

                          setSending(true);

                          const res = await fetch("/api/questions/answer", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              questionId: q.id,
                              answer,
                            }),
                          });

                          const data = await res.json();

                          if (!res.ok) {
                            setError(data.error || "Erreur lors de l’envoi.");
                            setSending(false);
                            return;
                          }

                          // Mise à jour locale
                          setQuestions((prev) =>
                            prev.map((item) =>
                              item.id === q.id
                                ? { ...item, answer }
                                : item
                            )
                          );

                          setActiveQuestion(null);
                          setAnswer("");
                          setSending(false);
                        }}
                        disabled={sending}
                        className="px-4 py-2 rounded-lg bg-[#1A3A5F] text-white hover:bg-[#16314f] transition"
                      >
                        {sending ? "Envoi..." : "Envoyer"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveQuestion(q.id)}
                    className="mt-4 px-4 py-2 bg-[#1A3A5F] text-white rounded-lg hover:bg-[#16314f] transition"
                  >
                    Répondre
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
}
